const tcgPlayer = module.exports;
const async = require('async');
const request = require('superagent');
const redis = require('../index.js');
var Xray = require('x-ray');
var xray = Xray();

tcgPlayer.priceCheck = (req, resp) => {
    var cardSet = req.body.set;
    var cardName = req.body.name;
    var redisQuery = cardName + ':' + cardSet;
    var imageQueryString =  'http://magictcgprices.appspot.com/api/images/imageurl.json?cardname=' + cardName;

    //dashes for spaces in card set and name
    //commas removed
    //colons removed for black market
    var temp1 = cardSet.split(' ').join('-');
    var newSet = temp1.replace(':', '');
    var temp2 = cardName.split(' ').join('-');
    var newName = temp2.replace(',', '');

    var storage = {
        //add magic for url and problem if card is not in cache first.
        link: 'http://shop.tcgplayer.com/magic/' + newSet + '/' + newName
    };

    redis.client.get(redisQuery, (err, price) => {
        if(err !== null) {
            throw(err);
        }
        if(price) {
            console.log('accessing cache');
            request
                .get(imageQueryString)
                .end((err ,res) => {
                    if(err) {
                        throw err;
                    }
                    storage.price = price;
                    storage.imgUrl = res.body;
                    resp.json(storage);
                });
        } else {
            console.log('not in cache; going to get it');
            async.parallel({
                imgUrl: (callback) => {
                    request
                        .get(imageQueryString)
                        .end((err ,res) => {
                            callback(err, res.body);
                        });
                },
                chemicalX: (callback) => {
                    xray(process.env.XRAY_SOURCE + newSet + '/' + newName, process.env.XRAY_TARGET)((err, data) => {
                        var chemicalX = Number(data.replace(/[^0-9\.]+/g,""));
                        redis.client.setex(redisQuery, chemicalX, 21600, () => {
                            callback(err, chemicalX);
                        });
                    });
                }
            }, (err, results) => {
                storage.price = results.chemicalX;
                storage.imgUrl = results.imgUrl;
                resp.json(storage);
            });
        }
    });
};
