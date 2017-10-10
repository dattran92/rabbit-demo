const amqp = require('amqp');
const logger = require('log4js').getLogger('dmqp');

const Dexchange = require('./dexchange');
const Dqueue = require('./dqueue');

class Dmqp {
  constructor(options) {
    this.options = options;
  }

  connect() {
    if (this.connection) {
      return Promise.resolve(this.connection);
    }

    return new Promise((resolve, reject) => {
      const connection = amqp.createConnection(this.options);
      connection.on('error', (e) => {
        logger.error('Error from amqp: ', e);
      });

      connection.on('ready', () => {
        logger.info('AMQP connection is open', this.options);
        this.connection = connection;
        return resolve(connection);
      });
    });
  }

  exchange(name, options) {
    options = options || {
      type: 'topic',
      autoDelete: false,
      durable: true,
      confirm: true
    };

    return new Promise((resolve, reject) => {
      this.connection.exchange(name, options, (exchange) => {
        logger.info('Exchange ' + exchange.name + ' is open');
        return resolve(new Dexchange(exchange));
      });
    });
  }

  queue(name, exchange, routingKey, options) {
    options = options || {
      durable: true,
      autoDelete: false
    }
    const queue = this.connection.queue(name, options);

    if (exchange) {
      return new Promise((resolve, reject) => {
        queue.bind(exchange, routingKey, () => {
          return resolve(new Dqueue(queue));
        });
      });
    }

    return Promise.resolve(new Dqueue(queue));
  }

  close() {
    this.connection.disconnect();
  }
}


module.exports = { Dmqp };
