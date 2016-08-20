const express = require('express');
const app = express();
const router = require('./router');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.connect('mongodb://localhost:mydb/mydb');

app.use(express.static(__dirname + '/../client/'));
app.use(bodyParser.json({ limit: '50mb', type: '*/*' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
router(app);

const port = process.env.PORT || 8200;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);
