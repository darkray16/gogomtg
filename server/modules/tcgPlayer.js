const tcgPlayer = module.exports;

tcgPlayer.priceCheck = (req, res) => {
    console.log('yeet');
    var cardName = req.body.name;
    var cardSet = req.body.set;
    var imageQueryString =  'http://magictcgprices.appspot.com/api/images/imageurl.json?cardname=' + cardName;
    res.send(200);
};
