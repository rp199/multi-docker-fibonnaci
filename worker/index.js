const key = require('./keys.js');
const redis = require('redis');

const redisClient = redis.createClient({
	host: key.redisHost,
	port: key.redisPort,
	retry_strategy: () => 1000
});

const sub = redisClient.duplicate();
const deletionSub = redisClient.duplicate();

//Intentionally slow strategy
function fib(index) {
	if (index <= 0) {
		return 0;
	}
	if (index < 2) {
		return 1;
	}
	return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
	redisClient.hset('values', message, fib(parseInt(message)));
	redisClient.hset('creationDate', message, JSON.stringify(new Date()));
});

sub.subscribe('insert');

deletionSub.on('message', (channel, message) => {
	let result;
	if (message == 'all') {
		result = redisClient.flushdb();
	} else {
		result = redisClient.del(message);
	}
	console.log(`Deletion success: ${result}. Deleted: ${message}`);
});

deletionSub.subscribe('delete');
