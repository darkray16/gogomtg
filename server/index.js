const express = require('express');
const app = express();
const router = require('./router');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const ENV = require('../.config.js');

const REDIS = module.exports;

REDIS.client = redis.createClient(ENV.REDIS_PORT, ENV.REDIS_ENDPOINT, {no_ready_check: true});
REDIS.client.auth(ENV.REDIS_PASSWORD, (err) => {
    if(err) {
        throw err;
    }
});

mongoose.connect('mongodb://localhost:mydb/mydb');
// mongoose.connect('mongodb://' + ENV.MONGO_USERNAME + ENV.MONGO_PASSWORD + '@ds027175.mlab.com:27175/' + ENV.MONGO_ENDPOINT);

app.use(express.static(__dirname + '/../client/'));
app.use(bodyParser.json({ limit: '50mb', type: '*/*' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
router(app);

REDIS.client.on('connect', () => {
    console.log('Connected to Redis');
    const port = process.env.PORT || 8200;
    const server = http.createServer(app);
    server.listen(port);
    console.log('Server listening on: ', port);
});
