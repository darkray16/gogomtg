const express = require('express');
const app = express();
const router = require('./router');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const ENV = require('dotenv').config();

const REDIS = module.exports;

REDIS.client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_ENDPOINT, {no_ready_check: true});
REDIS.client.auth(process.env.REDIS_PASSWORD, (err) => {
    if(err) {
        throw err;
    }
});

mongoose.connect('mongodb://localhost:mydb/mydb');
// mongoose.connect('mongodb://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@ds027175.mlab.com:27175/' + process.env.MONGO_ENDPOINT);

app.use(express.static(__dirname + '/../client/'));
app.use(bodyParser.json({ limit: '50mb', type: '*/*' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
router(app);

REDIS.client.on('connect', () => {
    console.log('Connected to Redis');
    var port;
    if(process.env.ENVIRONMENT === 'DEV') {
        port = process.env.DEV_PORT;
    } else {
        port = process.env.PROD_PORT;
    }
    const server = http.createServer(app);
    server.listen(port);
    console.log('Server listening on: ', port);
});
