// import cfg from './config/config.json';
const cfg = require('./config/config.json');
const EventsSubscriber = require('./subscribers/EventsSubscriber');

const args = process.argv.slice(2);

let queueName = args.find(a => a.indexOf('queue') === 0);

let exchangeName = args.find(a => a.indexOf('exchange') === 0);
let exchangeType = args.find(a => a.indexOf('type') === 0);
let routingKey = args.find(a => a.indexOf('routingKey') === 0);

if (!queueName && !exchangeName && !exchangeType && !routingKey) {
    throw 'Missing arguments. Provide following arguments: exchange, type and routingKey for subscribing exchange or queue for subscribing queue';
}

const subscriber = new EventsSubscriber(cfg.hostName, cfg.userName, cfg.password);

if(!!exchangeName && !!routingKey) {

    exchangeName = exchangeName.split('=')[1];
    routingKey = routingKey.split('=')[1];
    exchangeType = exchangeType.split('=')[1];

    if(exchangeType !== 'funout'){
        exchangeType = 'direct';
    }

    console.log(`Subscribing exchange: ${exchangeName}, routing: ${routingKey}. Exchange type: ${exchangeType}`); 
    subscriber.subscribeExchange(exchangeName, routingKey, exchangeType);
} else {

    queueName = queueName.split('=')[1];

    console.log(`Subscribing queue: ${queueName}`); 
    subscriber.subscribeQueue(queueName);
}