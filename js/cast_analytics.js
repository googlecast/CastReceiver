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

'use_strict';

/**
 * This sample demonstrates how to acquire and send Cast information to
 * different analytics services
 */

// Imports a mapping of event types for easier reference
import { CastEventType, EventOwner } from './cast_event_types.js';

/**
 * Initialize any analytics provider tracking agents.
 */
import { initGoogleAnalytics } from './agents/google_analytics.js';
initGoogleAnalytics();


/**
 * Modules that handle Cast SDK events. The Tracker class is a template for its
 * extending classes. Each should be customized to relay infomation about the
 * event captured to its respective backend services through the sendData()
 * method.
 */
class Tracker {
  constructor(trackerType) {
    this.context = cast.framework.CastReceiverContext.getInstance();
    this.playerManager = this.context.getPlayerManager();
    this.type = trackerType;
    this.castEventTypes = [];
  }

  /**
   * Creates the tracker's eventlisteners and binds them to its registered
   * SDK event types. Uses the CastEventType mapping imported from
   * cast_event_types.js.
   */
  startTracking() {
    this.castEventTypes.forEach((eventType) => {
      if (eventType.owner == EventOwner.PLAYER_MANAGER) {
        this.playerManager.addEventListener(eventType.event,
          this.handleEvent.bind(this));
      }

      else if (eventType.owner == EventOwner.CAST_RECEIVER_CONTEXT) {
        this.context.addEventListener(eventType.event,
          this.handleEvent.bind(this));
      }

      else {
        console.error("Unrecognized CastEventType: "
          + JSON.stringify(eventType));
      }
    });
  }

  /**
   * Template event handler that should be overidden in the child object.
   * @param  {cast.framework.events.*} event
   */
  handleEvent(event) {}

  /**
   * Template event sender that should be overidden in the child object.
   * Sends the data collected from the event handler to the target analytics
   * service providers.
   */
  sendData(data) {}
}

/**
 * Child of the tracker class used to handle ad related events and send them to
 * an analytics service. Event data tracked includes quartile ad events, ad
 * loading time, and break tracking.
 */
class AdsTracker extends Tracker {
  constructor() {
    super("ad");
    this.breakManager = this.playerManager.getBreakManager();
    this.breakStarted = false;
    this.breakEnded = false;
    this.breakClipStarted = false;
    this.breakClipEnded = false;
    this.breakClipCount = null;
    this.breakClipLength = null;
    this.breakClipPosition = null;
    this.breakClipId = null;
    this.breakId = null;
    this.qt1 = null;
    this.qt2 = null;
    this.qt3 = null;
    this.castEventTypes = [
      CastEventType.BREAK_ENDED,
      CastEventType.BREAK_CLIP_STARTED,
      CastEventType.BREAK_CLIP_LOADING,
      CastEventType.BREAK_CLIP_ENDED,
      CastEventType.BREAK_STARTED,
      CastEventType.TIME_UPDATE
    ];
  }

  /**
   * Handles the incoming event if it is a break event type or time update
   * while the break is started. When a time update is detected the type is
   * modified to create a custom quartile event with added break and breakClip
   * id for additional context.
   * @param  {cast.framework.events.BreaksEvent
   * |cast.framework.events.BreaksEvent.MediaElementEvent} event
   */
  handleEvent(event) {
    // Ignore event if the event is not a break started event
    if (!this.breakStarted) {
      if (event.type == CastEventType.BREAK_STARTED.event) {
        this.handleBreakStarted(event);
      }
      return;
    }

    // Control the state of the tracker and send data if break has begun
    switch (event.type) {
      case CastEventType.TIME_UPDATE.event:
        this.handleTimeUpdate(event);
        break;
      case CastEventType.BREAK_CLIP_STARTED.event:
        this.handleBreakClipStarted(event);
        break;
      case CastEventType.BREAK_CLIP_ENDED.event:
        this.handleBreakClipEnded(event);
        break;
      case CastEventType.BREAK_ENDED.event:
        this.handleBreakEnded(event);
        break;
    }
  }

  // Handle the break started event. Set flag to begin tracking relevant events.
  handleBreakStarted(event) {
    let data = {};
    this.breakStarted = true;
    this.breakId = event.breakId;

    data.action = event.type;
    data.id = event.breakId;

    // Adobe Agent specific values
    data.startTime = event.currentMediaTime;
    data.position = event.index;

    this.sendData(data);
  }

  // Handle time update event. Used to report quartile ad events.
  handleTimeUpdate(event) {
    let data = {};
    let currTime = this.breakManager.getBreakClipCurrentTimeSec();
    data.id = this.breakClipId;

    if (this.qt1 && currTime > this.qt1) {
      this.qt1 = null;
      data.action = 'BREAK_CLIP_QT1';
    } else if (this.qt2 && currTime > this.qt2) {
      this.qt2 = null;
      data.action = 'BREAK_CLIP_QT2';
    } else if (this.qt3 && currTime > this.qt3) {
      this.qt3 = null;
      data.action = 'BREAK_CLIP_QT3';
    } else {
      return;
    }

    this.sendData(data);
  }

  // Handle break clip started event. Sets up quartile ad tracking.
  handleBreakClipStarted(event) {
    let data = {};
    this.breakClipStarted = true;
    this.breakClipId = event.breakClipId;
    this.breakClipLength =
    this.breakManager.getBreakClipDurationSec();
    this.qt1 = this.breakClipLength / 4;
    this.qt2 = this.qt1 * 2;
    this.qt3 = this.qt1 * 3;

    data.id = this.breakClipId;
    data.action = event.type;

    // Adobe Agent specific values.
    data.position = event.index;
    data.length = this.breakClipLength;


    this.sendData(data);
  }

  // Handle break clip ended event. Resets quartile ad tracking.
  handleBreakClipEnded(event) {
    let data = {};
    data.id = this.breakClipId;
    this.breakClipStarted = false;
    this.breakClipLength = null;
    this.breakClipId = null;
    this.qt1 = null;
    this.qt2 = null;
    this.qt3 = null;

    data.action = event.endedReason;
    this.sendData(data);
  }

  // Handle break ended event. Reset tracker to ignore events until new break.
  handleBreakEnded(event) {
    let data = {};
    data.id = this.breakId;
    data.action = event.type;
    this.sendData(data);
    this.breakId = null;
    this.breakStarted = false;
  }


  /**
   * Sends the event data to respective analytics agents.
   * @param  {cast.framework.events.BreaksEvent|
   * cast.framework.events.BreaksEvent.MediaElementEvent} event
   */
  sendData(data) {
    ga('send', 'event', this.type, data.action, data.id);
  }
}


/**
 * Child of the tracker class used to profile the types of senders interacting
 * with the receiver. Each sender type is mapped to its senderId through the
 * regular expressions stored in this object.
 */
class SenderTracker extends Tracker {
  constructor() {
    super("sender");
    this.senders = {};
    this.castEventTypes = [
      CastEventType.REQUEST,
      CastEventType.SENDER_CONNECTED
    ];

    this.SenderIdRegex = {
      TOUCH_CONTROLS: "^__touch_controls__$",
      VOICE: "^__inject__$",
      CHROME_SENDER: "^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-"
        + "[a-z0-9]{12}\.[0-9]+\:[0-9]+$",
      IOS_SENDER: "^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-"
        + "[a-z0-9]{12}\.[0-9]+\:[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-"
        + "[A-Z0-9]{4}-[A-Z0-9]{12}$",
      ANDROID_SENDER: "^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-"
        + "[a-z0-9]{4}-[a-z0-9]{12}\.[0-9]+\:"
        + "(com.google.sample.cast.refplayer)-[0-9]+$"
    }
  }

  handleEvent(event) {
    //Map the event senderId to its senderType if not already registered.
    if (!this.senders[event.senderId]) {
      this.senders[event.senderId] = this.getSenderType(event.senderId);
      let data = {};
      data.action = "SENDER_CONNECTED";
      data.senderType = this.senders[event.senderId];
      if (data.senderType !== "OTHER_SENDER") {
        this.sendData(data);
      }
    }
  }

  // Obtains the senderType based on the senderId REGEX defined in this.
  getSenderType(senderId) {
    let senderType = null;
    Object.entries(this.SenderIdRegex).forEach(([currType, regex]) => {
      if (RegExp(regex).test(senderId)) {
        senderType = currType;
      }
    });

    return senderType || "OTHER_SENDER";
  }

  sendData(data) {
    ga('send', 'event', this.type, data.action, data.senderType);
  }
}


/**
 * Child of the tracker class. Used to determine if loaded content is suggested
 * or selected by the user. Requires the loaded media to have customData with
 * property isSuggested.
 */
class ContentTracker extends Tracker {
  constructor() {
    super("content");
    this.castEventTypes = [
      CastEventType.PLAYER_LOAD_COMPLETE,
    ];
  }

  handleEvent(event) {
    let data = {};

    if (event.media.customData
      && event.media.customData.isSuggested) {
      data.action = "SUGGESTED_CONTENT";
    }

    else {
      data.action = "USER_SELECTED_CONTENT";
    }

    data.id = event.media.entity
      || event.media.contentId
      || event.media.contentUrl;
    this.sendData(data);
  }

  sendData(data) {
    ga('send', 'event', this.type, data.action, data.id);
  }
}

export { AdsTracker, SenderTracker, ContentTracker };
