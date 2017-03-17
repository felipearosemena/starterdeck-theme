/**
 *
 * Event Bus
 *
 * Pub/Sub system for custom event communication between modules.
 *
 * Exports a single EventBus instace.
 *
 */

const topics = {};

const EventBus = {

  /**
   *
   * Subscribe to topic, passing a callback function
   *
   * @param {string} topic - event name to subscribe to
   * @param {function} listener - Callback function when event gets published
   *
   * @returns {object} Cancellable subscription object.
   * 
   */
  
  subscribe(topic, listener) {

    // Create the topic's object if not yet created
    if(!topics.hasOwnProperty(topic)) {
      topics[topic] = [];
    }

    // Add the listener to queue
    let index = topics[topic].push(listener) -1;

    // Provide handle back for removal of topic
    return {
      remove() {
        delete topics[topic][index];
      }
    };
  },

  /**
   *
   * Trigger event
   *
   * @param {string} topic - event name to publish
   * @param {...*} args - Any number of custom data to be passed to the callback
   * 
   */
  
  publish(topic) {

    // If the topic doesn't exist, or there's no listeners in queue, just leave
    if(!topics.hasOwnProperty(topic)) {
      return;
    }

    topics[topic].forEach((item) => {
      item.apply(null, Array.prototype.slice.call(arguments, 1));
    });
  }
};

export default EventBus
