const logger = require('log4js').getLogger('dmqp');

class Dqueue {
  constructor(queue) {
    this.queue = queue;
  }

  subscribe(options, cb) {
    let queueOptions;

    if (!cb) {
      cb = options;
      queueOptions = { ack: true, prefetchCount: 1 };
    } else {
      queueOptions = options
    }

    return new Promise((resolve, reject) => {
      this.queue.subscribe(queueOptions, (message, headers, deliveryInfo, ack) => {
        logger.debug('Received message', message);
        cb(message, headers, deliveryInfo, ack);
      });
    });
  }
}

module.exports = Dqueue;
