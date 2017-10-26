require('./common/base.js');
const { Dmqp } = require('./lib/dmqp');

const dmqp = new Dmqp({ host: 'localhost' });

const args = process.argv.slice(2);
const exchangeName = args[0];
const routingKey = args[1];
const numberOfMessage = parseInt(args[2]);

const createMessages = (numberOfMessage) => {
  const messages = [];
  for (let i = 0; i < numberOfMessage; i++) {
    messages.push({
      index: i + 1,
      rand: Math.random()
    });
  }
  return messages;
};

const start = async (messages) => {
  await startSync(messages);
};

// everything in once
const startAsync = async (messages) => {
  await dmqp.connect();
  const exchange = await dmqp.exchange(exchangeName);

  const promises = messages
    .map(message => {
      return exchange.publish(routingKey, message)
        .then(() => {
          console.log('Published', message);
          return Promise.resolve();
        });
    });
  await Promise.all(promises);
  dmqp.close();
};

// message goes after message
const startSync = async (messages) => {
  await dmqp.connect();
  const exchange = await dmqp.exchange(exchangeName);
  for (const message of messages) {
    await exchange.publish(routingKey, message)
    console.log('Published', message);
  }

  dmqp.close();
}

const messages = createMessages(numberOfMessage);
start(messages);
