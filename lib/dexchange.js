const logger = require('log4js').getLogger('dmqp');

class Dexchange {
  constructor(exchange) {
    this.exchange = exchange;
  }

  publish(routingKey, message, options) {
    options = options || {
      contentType: 'application/json',
      deliveryMode: 2
    };

    return new Promise((resolve, reject) => {
      this.exchange.publish(routingKey, message, options, (error) => {
        logger.debug(`published ${routingKey}`, message);
        if (!error) {
          return resolve();
        }
        return reject();
      });
    });
  }
}

module.exports = Dexchange;
