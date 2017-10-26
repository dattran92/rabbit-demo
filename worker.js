require('./common/base.js');
const { Dmqp } = require('./lib/dmqp');

const dmqp = new Dmqp({ host: 'localhost' });

const args = process.argv.slice(2);
const queueName = args[0];
const exchangeName = args[1];
const routingKey = args[2];

const processMessage = (message) => {
  return new Promise((resolve, reject) => {
    console.log('got message', message);
    setTimeout(() => {
      if (message.rand > 0.5) {
        console.log('success', message);
        return resolve();
      }
      console.log('fail', message);
      return reject();
    }, 20);
  });
}

const start = async () => {
  await dmqp.connect();
  const queue = await dmqp.queue(queueName, exchangeName, routingKey);

  queue.subscribe((message, headers, deliveryInfo, ack) => {
    processMessage(message)
      .then(() => {
        ack.acknowledge();
      })
      .catch(() => {
        ack.reject(false);
      });
  });
};

start();
