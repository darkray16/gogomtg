const tcgPlayer = module.exports;
const request = require('superagent');

tcgPlayer.priceCheck = (req, resp) => {
    console.log('yeet');
    var cardName = req.body.name;
    var cardSet = req.body.set;
    var imageQueryString =  'http://magictcgprices.appspot.com/api/images/imageurl.json?cardname=' + cardName;
    var priceQueryString = 'http://magictcgprices.appspot.com/api/cfb/price.json?cardname=' + cardName + '&cardset=' + cardSet;
    var clientObj = {};
    request
        .get(imageQueryString)
        .end((err ,res) => {
            if(err) {
                throw err;
            }
            console.log('image query success!');
            clientObj.imgUrl = res.body;
            request
                .get(priceQueryString)
                .end((err, res) => {
                    if(err) {
                        throw err;
                    }
                    console.log('price query success!');
                    clientObj.price = res.body;
                    resp.json(clientObj);
                });
        });
};
