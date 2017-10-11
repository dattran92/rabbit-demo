# RabbitMQ Demo

Since this is a very basic demo, I will not create configuration. Everything will be based on localhost

### SETUP

##### RabbitMQ

`$ docker run -d --hostname my-rabbit --name demo-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:management-alpine`

##### NodeJS

- NodeJS > 8.0 (Just for supporting async/await)

`$ npm install`

### RUN

##### publisher

`$ node publisher dat.test test.1 1000`

- dat.test: Name of the exchange
- test.1: Routing key for the messages to that exchange
- 1000: Number of messages to push

##### worker

In the real world, when creating the queue in the application, we should try binding the queue to the exchange to make sure we never miss any configuration.

`$ node worker test_q dat.test test.1`

- test_q: Name of the queue
- dat.test: Name of the exchange
- test.1: Routing key for the messages to that exchange
