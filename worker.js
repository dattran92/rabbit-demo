require('./common/base.js');
const { Dmqp } = require('./lib/dmqp');

const dmqp = new Dmqp({ host: 'localhost' });

const args = process.argv.slice(2);
const queueName = args[0];

const start = async () => {
  await dmqp.connect();
  const queue = await dmqp.queue('test_q');
  queue.subscribe((message, headers, deliveryInfo, ack) => {
    console.log(message);

    setTimeout(() => {
      ack.acknowledge();
    }, 3000);
  });
};

start();
