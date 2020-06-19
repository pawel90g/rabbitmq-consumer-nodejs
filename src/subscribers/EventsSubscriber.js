const amqp = require('amqplib/callback_api');

module.exports = class EventsSubscriber {

    constructor(hostName, userName, password) {
        this.hostName = hostName;
        this.userName = userName;
        this.password = password;
    }

    subscribeQueue(queue) {

        amqp.connect(`amqp://${this.userName}:${this.password}@${this.hostName}`, (connErr, connection) => {
            if (connErr) {
                throw connErr;
            }

            connection.createChannel((channelErr, channel) => {
                if (channelErr) {
                    throw error1;
                }
                channel.assertQueue(queue, {
                    durable: false
                });

                channel.consume(queue, (msg) => {
                    console.log("[NodeJS Consumer] Message received: %s", msg.content.toString());
                }, {
                    noAck: true
                });
            });
        });
    }

    subscribeExchange(exchange, routingKey, exchangeType) {
        amqp.connect(`amqp://${this.userName}:${this.password}@${this.hostName}`, (connErr, connection) => {
            if (connErr) {
                throw connErr;
            }

            connection.createChannel((channelErr, channel) => {
                if (channelErr) {
                    throw channelErr;
                }

                channel.assertExchange(exchange, exchangeType, {
                    durable: false
                });

                channel.assertQueue('', {
                    exclusive: true
                }, (assertionError, q) => {
                    if (assertionError) {
                        throw assertionError;
                    }

                    channel.bindQueue(q.queue, exchange, routingKey);
                    
                    channel.consume(q.queue, function (msg) {
                        console.log("[NodeJS Consumer] Message received: %s", msg.content.toString());
                    }, {
                        noAck: true
                    });
                });
            });
        });
    }
}