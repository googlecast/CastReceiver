/*
Copyright 2018 Google Inc. All Rights Reserved.

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

const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

// Listen and log all Core Events
playerManager.addEventListener(cast.framework.events.category.CORE,
  event => {
    console.log("Core event: " + event.type);
    console.log(event);
  });

const playbackConfig = new cast.framework.PlaybackConfig();

// Set the player to start playback as soon as there are five seconds of
// media content buffered. Default is 10.
playbackConfig.autoResumeDuration = 5;

context.start();
