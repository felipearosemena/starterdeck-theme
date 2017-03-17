/**
 *
 * Video Service
 *
 * Logic to setup different video iframe api services (currently Youtube and Vimeo)
 *
 * IMPORTANT: IOS devices don't allow you to use the service API to trigger play on the iframe.
 * Instead, allow the user to click directly on the ifram, which will work fine.
 * 
 */

import EventBus from './EventBus';
import { loadScriptOnce } from './load';

let playerOrigin = '*';

/**
 *
 * Helper function for sending a message to the vimeo player, taken from {@link Vimeo API}
 * {@link https://developer.vimeo.com/player/js-api Vimeo API}
 * 
 * @param {string} action - Name of the action to be posted to the iframe
 * @param {string} value - Value of the action to be posted to the iframe
 * @param {HTMLIFrameElement} playerIframe - Iframe DOM element of the player
 * 
 */

function postToVimeo(action, value, playerIframe) {

  var data = {
    method: action
  };

  if(value) {
    data.value = value;
  }

  var message = JSON.stringify(data);
  playerIframe.contentWindow.postMessage(message, playerOrigin);
}


/**
 *
 * Listen for 'message' events from the VIMEO iframe, and call the corresponding
 * handler from a provied configuration object
 *
 * @param {object} config - instance configuration object. Must have valid methods
 *                        Corresponding to the Vimeo API events
 * @param {HTMLIframeElement} iframe - Vimeo iframe video player
 *
 */

function initVimeo(config, iframe) {

  window.addEventListener('message', (e) => {

    let data = JSON.parse(e.data);
    
    // Handle messages from the vimeo player only
    if (!(/^https?:\/\/player.vimeo.com/).test(e.origin)) {
      return false;
    }
    
    // Return if the message is not from this iframe
    if(iframe.id !== data.player_id) {
      return false;
    }

    if (playerOrigin === '*') {
      playerOrigin = e.origin;
    }

    // Execute the handler for this event, if it's a valid function
    if(typeof config[data.event] == 'function') {
      config[data.event]()
    }

  }, false);
}


/**
 *
 * Youtube calls this function automatically once the API has loaded
 *
 */

const youtubeAPIPromise = new Promise(resolve => {
  window.onYouTubeIframeAPIReady = () => {
    resolve();
  }
});


/**
 *
 * Initialize a video service instance. Returns a `serviceController`
 * object for listening to API events  and controlling player with custom elements.
 *
 * @param {string} serviceName - Name of the service to initialize
 * @param {HTMLIframeElement} iframe - Iframe video player
 * @returns {object} serviceController - service video service controller instance.
 */

function initVideoService(serviceName, iframe) {

  let serviceReady = new Promise(resolve => {
    EventBus.subscribe('video-service:ready', (readyService, player) => {
      if(readyService == serviceName) {
        resolve(player)
      }
    })
  });

  // Instace controller
  let serviceController = {}

  // Since each service has a very different API, 
  // We have to assemble the `serviceController` for each type
  // in a different way, while still providing a consistent interface.
  switch (serviceName) {

    case 'vimeo':

      // Assign the controls methods for vimeo
      serviceController.play = () => {
        serviceReady.then(() => {
          postToVimeo('play', null, iframe);
        })
      }
      serviceController.stop = () => {
        serviceReady.then(() => {
          postToVimeo('pause', null, iframe);
        })
      }

      initVimeo({
        ready() {
          // Need to tell Vimeo that we want to listen for this events
          postToVimeo('addEventListener', 'play', iframe);
          postToVimeo('addEventListener', 'finish', iframe);

          EventBus.publish('video-service:ready', serviceName)

        },
        play() {
          EventBus.publish('video-service:play', iframe)
        },

        finish() {
          EventBus.publish('video-service:finish', iframe)
        }
      }, iframe)
    break;

    case 'youtube':

      // Assign control methods for youtube
      serviceController.play = () => {
        serviceReady.then((player) => {
          player.playVideo()
        })
      }
      serviceController.stop = () => {
        serviceReady.then((player) => {
          player.stopVideo()
        })
      }

      loadScriptOnce('https://www.youtube.com/iframe_api');

      youtubeAPIPromise.then(() => {
        
        let player = new YT.Player(iframe, {
          events: {
            onReady() {
              EventBus.publish('video-service:ready', serviceName, player)
            },
            onStateChange(e) {
              if(e.data == 1) {
                EventBus.publish('video-service:play', iframe)
              } else if (e.data == 0) {
                EventBus.publish('video-service:finish', iframe)
              }
            }
          }
        })

      })

    break;
  }

  return serviceController
}

export default initVideoService