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

'use_strict';

/**
 * Enumeration type for determining the dispatcher of each of the cast events.
 */
const EventOwner = {
  PLAYER_MANAGER: 1,
  CAST_RECEIVER_CONTEXT: 2
}

/**
 * Map for all the supported event types in the CAF SDK to be used by the
 * analytics modules. Note there is one overlapping event (ERROR) on both
 * system and standard events. Look at the mapping located in the object.
 * @enum {[cast.framework.events.EventType|cast.framework.system.EventType,
 *     EventOwner]}
 */
const CastEventType = {
  ALL: {event: cast.framework.events.EventType.ALL, owner: EventOwner.PLAYER_MANAGER},
  ABORT: {event: cast.framework.events.EventType.ABORT, owner: EventOwner.PLAYER_MANAGER},
  CAN_PLAY: {event: cast.framework.events.EventType.CAN_PLAY, owner: EventOwner.PLAYER_MANAGER},
  CAN_PLAY_THROUGH: {event: cast.framework.events.EventType.CAN_PLAY_THROUGH, owner: EventOwner.PLAYER_MANAGER},
  DURATION_CHANGE: {event: cast.framework.events.EventType.DURATION_CHANGE, owner: EventOwner.PLAYER_MANAGER},
  EMPTIED: {event: cast.framework.events.EventType.EMPTIED, owner: EventOwner.PLAYER_MANAGER},
  ENDED: {event: cast.framework.events.EventType.ENDED, owner: EventOwner.PLAYER_MANAGER},
  LOADED_DATA: {event: cast.framework.events.EventType.LOADED_DATA, owner: EventOwner.PLAYER_MANAGER},
  LOADED_METADATA: {event: cast.framework.events.EventType.LOADED_METADATA, owner: EventOwner.PLAYER_MANAGER},
  LOAD_START: {event: cast.framework.events.EventType.LOAD_START, owner: EventOwner.PLAYER_MANAGER},
  PAUSE: {event: cast.framework.events.EventType.PAUSE, owner: EventOwner.PLAYER_MANAGER},
  PLAY: {event: cast.framework.events.EventType.PLAY, owner: EventOwner.PLAYER_MANAGER},
  PLAYING: {event: cast.framework.events.EventType.PLAYING, owner: EventOwner.PLAYER_MANAGER},
  PROGRESS: {event: cast.framework.events.EventType.PROGRESS, owner: EventOwner.PLAYER_MANAGER},
  RATE_CHANGE: {event: cast.framework.events.EventType.RATE_CHANGE, owner: EventOwner.PLAYER_MANAGER},
  SEEKED: {event: cast.framework.events.EventType.SEEKED, owner: EventOwner.PLAYER_MANAGER},
  SEEKING: {event: cast.framework.events.EventType.SEEKING, owner: EventOwner.PLAYER_MANAGER},
  STALLED: {event: cast.framework.events.EventType.STALLED, owner: EventOwner.PLAYER_MANAGER},
  TIME_UPDATE: {event: cast.framework.events.EventType.TIME_UPDATE, owner: EventOwner.PLAYER_MANAGER},
  SUSPEND: {event: cast.framework.events.EventType.SUSPEND, owner: EventOwner.PLAYER_MANAGER},
  WAITING: {event: cast.framework.events.EventType.WAITING, owner: EventOwner.PLAYER_MANAGER},
  BITRATE_CHANGED: {event: cast.framework.events.EventType.BITRATE_CHANGED, owner: EventOwner.PLAYER_MANAGER},
  BREAK_STARTED: {event: cast.framework.events.EventType.BREAK_STARTED, owner: EventOwner.PLAYER_MANAGER},
  BREAK_ENDED: {event: cast.framework.events.EventType.BREAK_ENDED, owner: EventOwner.PLAYER_MANAGER},
  BREAK_CLIP_LOADING: {event: cast.framework.events.EventType.BREAK_CLIP_LOADING, owner: EventOwner.PLAYER_MANAGER},
  BREAK_CLIP_STARTED: {event: cast.framework.events.EventType.BREAK_CLIP_STARTED, owner: EventOwner.PLAYER_MANAGER},
  BREAK_CLIP_ENDED: {event: cast.framework.events.EventType.BREAK_CLIP_ENDED, owner: EventOwner.PLAYER_MANAGER},
  BUFFERING: {event: cast.framework.events.EventType.BUFFERING, owner: EventOwner.PLAYER_MANAGER},
  CACHE_LOADED: {event: cast.framework.events.EventType.CACHE_LOADED, owner: EventOwner.PLAYER_MANAGER},
  CACHE_HIT: {event: cast.framework.events.EventType.CACHE_HIT, owner: EventOwner.PLAYER_MANAGER},
  CACHE_INSERTED: {event: cast.framework.events.EventType.CACHE_INSERTED, owner: EventOwner.PLAYER_MANAGER},
  CLIP_STARTED: {event: cast.framework.events.EventType.CLIP_STARTED, owner: EventOwner.PLAYER_MANAGER},
  CLIP_ENDED: {event: cast.framework.events.EventType.CLIP_ENDED, owner: EventOwner.PLAYER_MANAGER},
  EMSG: {event: cast.framework.events.EventType.EMSG, owner: EventOwner.PLAYER_MANAGER},
  ERROR_PLAYER_MANAGER: {event: cast.framework.events.EventType.ERROR, owner: EventOwner.PLAYER_MANAGER},
  ID3: {event: cast.framework.events.EventType.ID3, owner: EventOwner.PLAYER_MANAGER},
  MEDIA_STATUS: {event: cast.framework.events.EventType.MEDIA_STATUS, owner: EventOwner.PLAYER_MANAGER},
  CUSTOM_STATE: {event: cast.framework.events.EventType.CUSTOM_STATE, owner: EventOwner.PLAYER_MANAGER},
  MEDIA_INFORMATION_CHANGED: {event: cast.framework.events.EventType.MEDIA_INFORMATION_CHANGED, owner: EventOwner.PLAYER_MANAGER},
  MEDIA_FINISHED: {event: cast.framework.events.EventType.MEDIA_FINISHED, owner: EventOwner.PLAYER_MANAGER},
  PLAYER_PRELOADING: {event: cast.framework.events.EventType.PLAYER_PRELOADING, owner: EventOwner.PLAYER_MANAGER},
  PLAYER_PRELOADING_CANCELLED: {event: cast.framework.events.EventType.PLAYER_PRELOADING_CANCELLED, owner: EventOwner.PLAYER_MANAGER},
  PLAYER_LOAD_COMPLETE: {event: cast.framework.events.EventType.PLAYER_LOAD_COMPLETE, owner: EventOwner.PLAYER_MANAGER},
  PLAYER_LOADING: {event: cast.framework.events.EventType.PLAYER_LOADING, owner: EventOwner.PLAYER_MANAGER},
  SEGMENT_DOWNLOADED: {event: cast.framework.events.EventType.SEGMENT_DOWNLOADED, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_SEEK: {event: cast.framework.events.EventType.REQUEST_SEEK, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_LOAD: {event: cast.framework.events.EventType.REQUEST_LOAD, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_STOP: {event: cast.framework.events.EventType.REQUEST_STOP, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_PAUSE: {event: cast.framework.events.EventType.REQUEST_PAUSE, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_PRECACHE: {event: cast.framework.events.EventType.REQUEST_PRECACHE, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_PLAY: {event: cast.framework.events.EventType.REQUEST_PLAY, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_SKIP_AD: {event: cast.framework.events.EventType.REQUEST_SKIP_AD, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_PLAY_AGAIN: {event: cast.framework.events.EventType.REQUEST_PLAY_AGAIN, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_PLAYBACK_RATE_CHANGE: {event: cast.framework.events.EventType.REQUEST_PLAYBACK_RATE_CHANGE, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_VOLUME_CHANGE: {event: cast.framework.events.EventType.REQUEST_VOLUME_CHANGE, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_EDIT_TRACKS_INFO: {event: cast.framework.events.EventType.REQUEST_EDIT_TRACKS_INFO, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_EDIT_AUDIO_TRACKS: {event: cast.framework.events.EventType.REQUEST_EDIT_AUDIO_TRACKS, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_SET_CREDENTIALS: {event: cast.framework.events.EventType.REQUEST_SET_CREDENTIALS, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_LOAD_BY_ENTITY: {event: cast.framework.events.EventType.REQUEST_LOAD_BY_ENTITY, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_USER_ACTION: {event: cast.framework.events.EventType.REQUEST_USER_ACTION, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_DISPLAY_STATUS: {event: cast.framework.events.EventType.REQUEST_DISPLAY_STATUS, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_CUSTOM_COMMAND: {event: cast.framework.events.EventType.REQUEST_CUSTOM_COMMAND, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_FOCUS_STATE: {event: cast.framework.events.EventType.REQUEST_FOCUS_STATE, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_QUEUE_LOAD: {event: cast.framework.events.EventType.REQUEST_QUEUE_LOAD, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_QUEUE_INSERT: {event: cast.framework.events.EventType.REQUEST_QUEUE_INSERT, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_QUEUE_UPDATE: {event: cast.framework.events.EventType.REQUEST_QUEUE_UPDATE, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_QUEUE_REMOVE: {event: cast.framework.events.EventType.REQUEST_QUEUE_REMOVE, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_QUEUE_REORDER: {event: cast.framework.events.EventType.REQUEST_QUEUE_REORDER, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_QUEUE_GET_ITEM_RANGE: {event: cast.framework.events.EventType.REQUEST_QUEUE_GET_ITEM_RANGE, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_QUEUE_GET_ITEMS: {event: cast.framework.events.EventType.REQUEST_QUEUE_GET_ITEMS, owner: EventOwner.PLAYER_MANAGER},
  REQUEST_QUEUE_GET_ITEM_IDS: {event: cast.framework.events.EventType.REQUEST_QUEUE_GET_ITEM_IDS, owner: EventOwner.PLAYER_MANAGER},
  LIVE_IS_MOVING_WINDOW_CHANGED: {event: cast.framework.events.EventType.LIVE_IS_MOVING_WINDOW_CHANGED, owner: EventOwner.PLAYER_MANAGER},
  LIVE_ENDED: {event: cast.framework.events.EventType.LIVE_ENDED, owner: EventOwner.PLAYER_MANAGER},
  READY: {event: cast.framework.system.EventType.READY, owner: EventOwner.CAST_RECEIVER_CONTEXT},
  SHUTDOWN: {event: cast.framework.system.EventType.SHUTDOWN, owner: EventOwner.CAST_RECEIVER_CONTEXT},
  SENDER_CONNECTED: {event: cast.framework.system.EventType.SENDER_CONNECTED, owner: EventOwner.CAST_RECEIVER_CONTEXT},
  SENDER_DISCONNECTED: {event: cast.framework.system.EventType.SENDER_DISCONNECTED, owner: EventOwner.CAST_RECEIVER_CONTEXT},
  ERROR_SYSTEM: {event: cast.framework.system.EventType.ERROR_SYSTEM, owner: EventOwner.CAST_RECEIVER_CONTEXT},
  SYSTEM_VOLUME_CHANGED: {event: cast.framework.system.EventType.SYSTEM_VOLUME_CHANGED, owner: EventOwner.CAST_RECEIVER_CONTEXT},
  VISIBILITY_CHANGED: {event: cast.framework.system.EventType.VISIBILITY_CHANGED, owner: EventOwner.CAST_RECEIVER_CONTEXT},
  STANDBY_CHANGED: {event: cast.framework.system.EventType.STANDBY_CHANGED, owner: EventOwner.CAST_RECEIVER_CONTEXT},
  MAX_VIDEO_RESOLUTION: {event: cast.framework.system.EventType.MAX_VIDEO_RESOLUTION, owner: EventOwner.CAST_RECEIVER_CONTEXT},
  FEEDBACK_STARTED: {event: cast.framework.system.EventType.FEEDBACK_STARTED, owner: EventOwner.CAST_RECEIVER_CONTEXT},
  CORE: {event: cast.framework.events.category.CORE, owner: EventOwner.PLAYER_MANAGER},
  DEBUG: {event: cast.framework.events.category.DEBUG, owner: EventOwner.PLAYER_MANAGER},
  FINE: {event: cast.framework.events.category.FINE, owner: EventOwner.PLAYER_MANAGER},
  REQUEST: {event: cast.framework.events.category.REQUEST, owner: EventOwner.PLAYER_MANAGER}
}

export {CastEventType, EventOwner};