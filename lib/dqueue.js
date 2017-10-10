const logger = require('log4js').getLogger('dmqp');

class Dqueue {
  constructor(queue) {
    this.queue = queue;
  }

  subscribe(cb) {
    const options = { ack: true, prefetchCount: 1 };
    return new Promise((resolve, reject) => {
      this.queue.subscribe(options, (message, headers, deliveryInfo, ack) => {
        logger.debug('Received message', message);
        cb(message, headers, deliveryInfo, ack);
      });
    });
  }
}

module.exports = Dqueue;
