const tcgPlayer = module.exports;
const async = require('async');
const request = require('superagent');
const redis = require('../index.js');

tcgPlayer.priceCheck = (req, resp) => {
    var cardSet = req.body.set;
    var cardName = req.body.name;
    var redisQuery = cardName + ':' + cardSet;
    var imageQueryString =  'http://magictcgprices.appspot.com/api/images/imageurl.json?cardname=' + cardName;
    // var priceQueryString = NOT_APPROVED;
    // var link = 'http://store.tcgplayer.com/Products.aspx?GameName=Magic&amp;Name=' + cardName +'&partner=' + ENV.TCG_PARTNERKEY;
    var storage = {
        low: '0.0240',
        med: '0.2456',
        high: '0.4641',
        link: 'www.tcgplayer.com'
    };

/*
    async.parallel({
        imageUrl: (callback) => {
            request
                .get(imageQueryString)
                .end((err ,res) => {
                    callback(err, res.body);
                });
        },
        prices: (callback) => {
            request
                .get(priceQueryString)
                .end((err, res) => {
                    // query and parse xml and turn to json to store in storage
                    redis.client.set(redisQuery, 'low*med*high');
                    callback(err, parsedXMLobj);
                });
        }
    }, (err, results) => {
        resp.json(storage);
    });
*/

    redis.client.get(redisQuery, (err, data) => {
        if(err !== null) {
            throw(err);
        }
        if(data) {
            var prices = data;
            // parse the prices string .split('*');
            console.log('accessing cache');
            request
                .get(imageQueryString)
                .end((err ,res) => {
                    if(err) {
                        throw err;
                    }
                    console.log('image query success!');
                    storage.imgUrl = res.body;
                    resp.json(storage);
                });
        } else {
            console.log('sike');
            request
                .get(imageQueryString)
                .end((err ,res) => {
                    if(err) {
                        throw err;
                    }
                    console.log('image query success!');
                    storage.imgUrl = res.body;
                    redis.client.set(redisQuery, 'low*med*high');
                    resp.json(storage);
                });
        }
    });
};
