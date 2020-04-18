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

    const client = new StompJs.Client({
      brokerURL: "ws://localhost:15674/ws",
      connectHeaders: {
        login: "guest",
        passcode: "guest"
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });
    
  client.debug = function(str) {
    console.log(str);
  };

    client.onConnect = function(frame) {
      // Do something, all subscribes must be done is this callback
      // This is needed because this will be executed after a (re)connect
    };
    
    client.onStompError = function (frame) {
      // Will be invoked in case of error encountered at Broker
      // Bad login/passcode typically will cause an error
      // Complaint brokers will set `message` header with a brief message. Body may contain details.
      // Compliant brokers will terminate the connection after any error
      console.log('Broker reported error: ' + frame.headers['message']);
      console.log('Additional details: ' + frame.body);
    };
    
    client.activate();

function generateBinaryData() {
    let buffer = new Int8Array(16);
    return buffer
}
    var binaryData = generateBinaryData(); // This need to be of type Uint8Array
    // setting content-type header is not mandatory, however a good practice
    client.publish({destination: '', binaryBody: binaryData,
                    headers: {'content-type': 'application/octet-stream'}});
//    client.publish({destination: '/topic/general', body: 'Hello world'});
//
//    // There is an option to skip content length header
    client.publish({destination: '/example', body: 'Hello world', skipContentLengthHeader: true});
//    
//    // Additional headers
//    client.publish({destination: '/topic/general', body: 'Hello world', headers: {'priority': '9'}});


  var callback = function(message) {
    // called when the client receives a STOMP message from the server
    if (message.body) {
      alert("got message with body " + message.body)
    } else {
      alert("got empty message");
    }
  };
  var subscription = client.subscribe("/queue/test", callback);

// Create a socket instance
//var socket = new WebSocket('ws://localhost:61613');
//
//// Open the socket
//socket.onopen = function(event) {
//
//    // Send an initial message
//    socket.send('I am the client and I\'m listening!');
//
//    // Listen for messages
//    socket.onmessage = function(event) {
//        console.log('Client received a message',event);
//    };
//
//    // Listen for socket closes
//    socket.onclose = function(event) {
//        console.log('Client notified socket has closed',event);
//    };
//
//    // To close the socket....
//    socket.close()
//
//};

const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

// enable debug log
context.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
const castDebugLogger = cast.debug.CastDebugLogger.getInstance();

// Enable debug logger and show a warning on receiver
// NOTE: make sure it is disabled on production
castDebugLogger.setEnabled(true);

// Show debug overlay
castDebugLogger.showDebugLogs(true);

// Listen and log all Core Events.
playerManager.addEventListener(cast.framework.events.category.CORE,
  event => {
    console.log("Core event: " + event.type);
    console.log(event);
    castDebugLogger.info("ANALYTICS", event);
  });

playerManager.addEventListener(
  cast.framework.events.EventType.MEDIA_STATUS, (event) => {
    console.log("MEDIA_STATUS event: " + event.type);
    console.log(event);
});

// Intercept the LOAD request to be able to read in a contentId and get data.
playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD, loadRequestData => {
    castDebugLogger.info('MyAPP.LOG', 'Intercepting LOAD request');
    return loadRequestData;
  });

// Set verbosity level for custom tags
castDebugLogger.loggerLevelByTags = {
    'MyAPP.LOG': cast.framework.LoggerLevel.WARNING,
    'ANALYTICS': cast.framework.LoggerLevel.INFO,
};

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
  maxInactivity: 3600,
  queue: new CastQueue(),
  playbackConfig: playbackConfig,
  supportedCommands: cast.framework.messages.Command.ALL_BASIC_MEDIA |
                      cast.framework.messages.Command.QUEUE_PREV |
                      cast.framework.messages.Command.QUEUE_NEXT
});


