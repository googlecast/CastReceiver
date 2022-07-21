/**
Copyright 2022 Google LLC. All Rights Reserved.

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

'use strict';

import { MediaFetcher } from './media_fetcher.js';

/*
 * Set up Debug Logger constants and instance.
 */
const LOG_QUEUE_TAG = 'Queue';
const castDebugLogger = cast.debug.CastDebugLogger.getInstance();

if (!castDebugLogger.loggerLevelByTags) {
  castDebugLogger.loggerLevelByTags = {};
}

// Set verbosity level for custom tag.
castDebugLogger.loggerLevelByTags[LOG_QUEUE_TAG] =
  cast.framework.LoggerLevel.INFO;

/**
 * Custom implementation of the cast receiver queue. The class overrides
 * several QueueBase methods to provide extended queueing functionality such as
 * providing next and previous items in the media queue. Items are populated by
 * fetching them from a backend repository with sample assets.
 */
class CastQueue extends cast.framework.QueueBase {
  constructor() {
    super();
  }

  /**
  * Initializes the queue.
  * @param {!cast.framework.messages.LoadRequestData} loadRequestData
  * @return {!cast.framework.messages.QueueData}
  * @override
  */
  initialize(loadRequestData) {
    if (loadRequestData) {
      let queueData = loadRequestData.queueData;

      // Create a new queue with media from load request if one doesn't exist.
      if (!queueData || !queueData.items || !queueData.items.length) {
        castDebugLogger.info(LOG_QUEUE_TAG,
          'Creating a new queue with media from the load request');
        queueData = new cast.framework.messages.QueueData();
        let item = new cast.framework.messages.QueueItem();
        item.media = loadRequestData.media;
        queueData.items = [item];
      }
      return queueData;
    }
 }

  /**
  * Picks a set of items after the reference item id and returns as the next
  * items to be inserted into the queue. When referenceItemId is omitted, items
  * are simply appended to the end of the queue.
  * @param {number} referenceItemId
  * @return {!Array<cast.framework.QueueItem>}
  * @override
  **/
  nextItems(referenceItemId) {
    // Fetch and return sample content with populated metadata.
    return MediaFetcher.fetchMediaInformationById('bbb')
    .then(mediaInformation => {
      let item = new cast.framework.messages.QueueItem();
      item.media = mediaInformation;
      item.media.customData = { "isSuggested": true };
      return [item];
    });
  }

  /**
  * Picks a set of items before the reference item id and returns as the items
  * to be inserted into the queue. When referenceItemId is omitted, items are
  * simply appended to beginning of the queue.
  * @param {number} referenceItemId
  * @return {!Array<cast.framework.QueueItem>}
  * @override
  **/
  prevItems(referenceItemId) {
    // Fetch and return sample content with populated metadata.
    return MediaFetcher.fetchMediaInformationById('ed')
    .then(mediaInformation => {
      let item = new cast.framework.messages.QueueItem();
      item.media = mediaInformation;
      item.media.customData = { "isSuggested": true };
      return [item];
    });
  }
};

export {
  CastQueue
};
