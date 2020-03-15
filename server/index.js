const keys = require('./keys');

//Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	database: keys.pgDataBase,
	password: keys.pgPassword,
	port: keys.pgPort
});

const saveAndPublish = index => {
	redisClient.hset('values', index, 'null');
	redisPublisher.publish('insert', index);
	pgClient.query(
		'INSERT INTO values(number) VALUES($1) ON CONFLICT DO NOTHING',
		[index]
	);
};

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
	.query(
		'CREATE TABLE IF NOT EXISTS values (number INT CONSTRAINT firstkey PRIMARY KEY)'
	)
	.catch(err => console.log(err));

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

const requestRedisFlush = () => redisPublisher.publish('delete', 'all');

//Express route hadlers
app.get('/', (req, res) => {
	res.send('Hi');
});

app.get('/values/all', async (req, res) => {
	const values = await pgClient.query('SELECT * from values');
	res.send(values.rows);
});

app.delete('/values/all', async (req, res) => {
	await pgClient
		.query('DELETE from values')
		.then(result => {
			console.log(`Deleted ${result.rowCount} rows`);
			res.send(200);
		})
		.catch(err => {
			console.log(err);
			res.send(500);
		});
});

app.get('/values/current', async (req, res) => {
	const { indexes } = req.query;
	console.log(indexes);
	if (indexes === undefined || indexes.length === 0) {
		redisClient.hgetall('values', (err, values) => {
			res.send(values);
			console.log(values);
		});
	} else {
		redisClient.hmget('values', indexes, (err, values) => {
			const result = indexes.reduce((obj, index, i) => {
				obj[index] = values[i];
				return obj;
			}, {});
			console.log(result);
			res.send(result);
		});
	}
});

app.delete('/values/current', async (req, res) => {
	requestRedisFlush();
	res.send(200);
});

app.post('/values', async (req, res) => {
	const index = parseInt(req.body.index);
	if (index > 40) {
		return res.status(422).send('Index too high');
	}

	if (isNaN(index)) {
		return res.status(400).send('Must be an integer');
	}

	saveAndPublish(index);

	res.send({ working: true });
});

app.post('/sequence/generate', async (req, res) => {
	const sequenceLength = parseInt(req.body.sequenceLength);
	console.log(req.body);
	redisClient.hmget(
		'values',
		[...Array(sequenceLength).keys()],
		(err, values) => {
			const result = values.reduce((obj, index, i) => {
				obj[i] = values[i];
				if (values[i] === null) {
					saveAndPublish(i);
				}
				return obj;
			}, {});
			res.send(result);
		}
	);
});

app.listen(5000, err => {
	console.log('Listening');
});
