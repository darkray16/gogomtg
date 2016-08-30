const tcgPlayer = module.exports;
const request = require('superagent');
const redis = require('redis');

tcgPlayer.priceCheck = (req, resp) => {
    var cardName = req.body.name;
    var cardSet = req.body.set;
    var imageQueryString =  'http://magictcgprices.appspot.com/api/images/imageurl.json?cardname=' + cardName;
    var MOCKTCG = {
        low: '0.0240',
        med: '0.2456',
        high: '0.4641',
        link: 'www.tcgplayer.com'
    };
    request
        .get(imageQueryString)
        .end((err ,res) => {
            if(err) {
                throw err;
            }
            console.log('image query success!');
            MOCKTCG.imgUrl = res.body;
            request
                .get(priceQueryString)
                .end((err, res) => {
                    if(err) {
                        throw err;
                    }
                    console.log('price query success!');
                    resp.json(MOCKTCG);
                });
        });
};
