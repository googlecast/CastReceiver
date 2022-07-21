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
 * Fetches assets from the sample content repository.
 */
class MediaFetcher {
  static CONTENT_URL =
    'https://storage.googleapis.com/cpe-sample-media/content.json';

  /**
   * Obtains the media's details from a remote repository.
   * @param  {string} Entity or ID that contains a key to the media in the
   *     JSON hosted by CONTENT_URL.
   * @return {Promise<Object|string>} Contains the media information of the
   *     desired entity.
   */
  static fetchMediaById(id) {
    return new Promise((accept, reject) => {
      fetch(MediaFetcher.CONTENT_URL)
      .then((response) => response.json())
      .then((obj) => {
        if (obj) {
          if (obj[id]) {
            accept(obj[id]);
          }
          else {
            reject(`${id} not found in repository.`);
          }
        }
        else {
          reject('Content repository not found.');
        }
      });
    });
  }

  /**
   * Fetches a media item from the remote repository and creates a DASH stream
   * MediaInformation object from it.
   * @param {String} Entity or ID that contains a key to the media in the
   *     JSON hosted by CONTENT_URL.
   * @return {Promise<cast.framework.messages.MediaInformation|string>} The
   *     MediaInformation object when fetched successfully.
   */
  static fetchMediaInformationById(id) {
    return MediaFetcher.fetchMediaById(id)
    .then((item) => {
      let mediaInfo = new cast.framework.messages.MediaInformation();
      let metadata = new cast.framework.messages.GenericMediaMetadata();

      metadata.title = item.title;
      metadata.subtitle = item.description;
      mediaInfo.contentUrl = item.stream.dash;
      mediaInfo.contentType = 'application/dash+xml';
      mediaInfo.metadata = metadata;

      return mediaInfo;
    });
  }
}

export {
  MediaFetcher
};