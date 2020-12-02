/*
Copyright 2020 Google LLC. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * This sample demonstrates how to build your own Receiver for use with Google
 * Cast.
 */

'use strict';

import { CastQueue } from './queuing.js';
import { AdsTracker, SenderTracker, ContentTracker } from './cast_analytics.js';

/**
 * Constants to be used for fetching media by entity from sample repository.
 */
const ENTITY_REGEX = '([^\/]+$)';
const CONTENT_URL = 'https://storage.googleapis.com/cpe-sample-media/content.json';

const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();


const LOG_RECEIVER_TAG = 'Receiver';

/**
 * Debug Logger
 */
const castDebugLogger = cast.debug.CastDebugLogger.getInstance();

/**
 * WARNING: Make sure to turn off debug logger for production release as it
 * may expose details of your app.
 * Uncomment below line to enable debug logger and show a 'DEBUG MODE' tag at
 * top left corner.
 */
// castDebugLogger.setEnabled(true);

/**
 * Uncomment below line to show debug overlay.
 */
// castDebugLogger.showDebugLogs(true);

/**
 * Set verbosity level for Core events.
 */
castDebugLogger.loggerLevelByEvents = {
  'cast.framework.events.category.CORE':
    cast.framework.LoggerLevel.INFO,
  'cast.framework.events.EventType.MEDIA_STATUS':
    cast.framework.LoggerLevel.DEBUG
};

if (!castDebugLogger.loggerLevelByTags) {
  castDebugLogger.loggerLevelByTags = {};
}

/**
 * Set verbosity level for custom tag.
 * Enables log messages for error, warn, info and debug.
 */
castDebugLogger.loggerLevelByTags[LOG_RECEIVER_TAG] =
  cast.framework.LoggerLevel.DEBUG;

/**
 * Example of how to listen for events on playerManager.
 */
playerManager.addEventListener(
  cast.framework.events.EventType.ERROR, (event) => {
    castDebugLogger.error(LOG_RECEIVER_TAG,
      'Detailed Error Code - ' + event.detailedErrorCode);
    if (event && event.detailedErrorCode == 905) {
      castDebugLogger.error(LOG_RECEIVER_TAG,
        'LOAD_FAILED: Verify the load request is set up ' +
        'properly and the media is able to play.');
    }
});

/**
 * Example analytics tracking implementation. See cast_analytics.js. Must
 * complete TODO item in google_analytics.js.
 */
const adTracker = new AdsTracker();
const senderTracker = new SenderTracker();
const contentTracker = new ContentTracker();
// adTracker.startTracking();
// senderTracker.startTracking();
// contentTracker.startTracking();

/**
 * Adds an ad to the beginning of the desired content.
 * @param {cast.framework.messages.MediaInformation} mediaInformation The target
 * mediainformation. Usually obtained through a load interceptor.
 */
function addBreaks(mediaInformation) {
  return fetchMediaByEntity('https://sample.com/ads/fbb_ad')
  .then((clip1) => {
    mediaInformation.breakClips = [
      {
        id: 'fbb_ad',
        title: clip1.title,
        contentUrl: clip1.stream.dash,
        contentType: 'application/dash+xml',
        whenSkippable: 5
      }
    ];

    mediaInformation.breaks = [
      {
        id: 'pre-roll',
        breakClipIds: ['fbb_ad'],
        position: 0
      }
    ];
  });
}

/**
 * Obtains media from a remote repository.
 * @param  {Number} Entity that contains the key to the json object's media id.
 * @return {Promise} Contains the media information of the desired entity.
 */
function fetchMediaByEntity(entity) {
  console.log(`Entity: ${entity}`);
  let key = entity.match(ENTITY_REGEX)[0];
  console.log(`Key: ${key}`);
  if (!key) {
    reject(`Unrecognized entity format ${entity}`);
  }

  return new Promise((accept, reject) => {
    fetch(CONTENT_URL)
    .then((response) => response.json())
    .then((obj) => {
      if (obj) {
        if (obj[key]) {
          accept(obj[key]);
        }
        else {
          reject(`${key} not found in repository`);
        }
      }
      else {
        reject('content repository not found');
      }
    });
  });
}


/**
 * Intercept the LOAD request to be able to read in a contentId and get data.
 */
playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD, loadRequestData => {
    castDebugLogger.debug(LOG_RECEIVER_TAG,
      `LOAD interceptor loadRequestData: ${JSON.stringify(loadRequestData)}`);
    if (!loadRequestData || !loadRequestData.media) {
      const error = new cast.framework.messages.ErrorData(
        cast.framework.messages.ErrorType.LOAD_FAILED);
      error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
      castDebugLogger.error(LOG_RECEIVER_TAG, 'Invalid load request');
      return error;
    }
    if (!loadRequestData.media.contentUrl) {
      castDebugLogger.warn(LOG_RECEIVER_TAG,
        'Playable URL is missing. Using ContentId as a fallback.');
    }
    if (!loadRequestData.media.contentId) {
        castDebugLogger.warn(LOG_RECEIVER_TAG,
          'Missing Content ID and Playable URL. Using entity as a fallback');
    }

    if (!loadRequestData.media.entity && loadRequestData.media.contentId) {
      loadRequestData.media.entity = loadRequestData.media.contentId;
      castDebugLogger.info(LOG_RECEIVER_TAG,
          'Setting entity to contentId');
    }
    if (loadRequestData.media.entity) {
      castDebugLogger.info(LOG_RECEIVER_TAG,
          `Loading entity ${loadRequestData.media.entity} from API`);
      return new Promise((accept, reject) => {
        addBreaks(loadRequestData.media)
        .then(() => fetchMediaByEntity(loadRequestData.media.entity))
        .then((item) => {
          if (!item) {
            reject();
          }

          let metadata = new cast.framework.messages.GenericMediaMetadata();
          metadata.title = item.title;
          metadata.subtitle = item.description;
          loadRequestData.media.contentId = item.stream.dash;
          loadRequestData.media.contentType = 'application/dash+xml';
          loadRequestData.media.metadata = metadata;
          accept(loadRequestData);
        })
      });
    }
    else {
      castDebugLogger.error(LOG_RECEIVER_TAG,
          "Request missing valid target: no contentUrl, contentId, or entity");
    }

    return loadRequestData;
  });

const playbackConfig = new cast.framework.PlaybackConfig();

/**
 * Set the player to start playback as soon as there are five seconds of
 * media content buffered. Default is 10.
 */
playbackConfig.autoResumeDuration = 5;
castDebugLogger.info(LOG_RECEIVER_TAG,
  `autoResumeDuration set to: ${playbackConfig.autoResumeDuration}`);

/**
 * Set the control buttons in the UI controls.
 */
const controls = cast.framework.ui.Controls.getInstance();
controls.clearDefaultSlotAssignments();

/**
 * Assign buttons to control slots.
 */
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_SECONDARY_1,
  cast.framework.ui.ControlsButton.QUEUE_PREV
);
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_PRIMARY_1,
  cast.framework.ui.ControlsButton.CAPTIONS
);
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_PRIMARY_2,
  cast.framework.ui.ControlsButton.SEEK_FORWARD_15
);
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_SECONDARY_2,
  cast.framework.ui.ControlsButton.QUEUE_NEXT
);

context.start({
  queue: new CastQueue(),
  playbackConfig: playbackConfig,
  supportedCommands: cast.framework.messages.Command.ALL_BASIC_MEDIA |
                      cast.framework.messages.Command.QUEUE_PREV |
                      cast.framework.messages.Command.QUEUE_NEXT |
                      cast.framework.messages.Command.STREAM_TRANSFER
});
