/*
Copyright 2019 Google LLC. All Rights Reserved.

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
/*
This sample demonstrates how to build your own Receiver for use with Google
Cast.
*/

'use strict';

import { CastQueue } from './queuing.js';

const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

// Listen and log all Core Events.
playerManager.addEventListener(cast.framework.events.category.CORE,
  event => {
    console.log("Core event: " + event.type);
    console.log(event);
  });

playerManager.addEventListener(
  cast.framework.events.EventType.MEDIA_STATUS, (event) => {
    console.log("MEDIA_STATUS event: " + event.type);
    console.log(event);
});

// Intercept the LOAD request to be able to read in a contentId and get data.
playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD, loadRequestData => {
    return loadRequestData;
  });

const playbackConfig = new cast.framework.PlaybackConfig();

// Set the player to start playback as soon as there are five seconds of
// media content buffered. Default is 10.
playbackConfig.autoResumeDuration = 5;

// Set the available buttons in the UI controls.
const controls = cast.framework.ui.Controls.getInstance();
controls.clearDefaultSlotAssignments();

// Assign buttons to control slots.
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_1,
  cast.framework.ui.ControlsButton.QUEUE_PREV
)
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_2,
  cast.framework.ui.ControlsButton.CAPTIONS
)
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_3,
  cast.framework.ui.ControlsButton.SEEK_FORWARD_15
)
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_4,
  cast.framework.ui.ControlsButton.QUEUE_NEXT
)

context.start({
  queue: new CastQueue(),
  playbackConfig: playbackConfig,
  supportedCommands: cast.framework.messages.Command.ALL_BASIC_MEDIA |
                      cast.framework.messages.Command.QUEUE_PREV |
                      cast.framework.messages.Command.QUEUE_NEXT
});


