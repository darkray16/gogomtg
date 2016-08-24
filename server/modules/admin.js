const Admin = module.exports;
const Card = require('../models/card');

Admin.putCardsInDB = (req, res) => {
    req.body.allthecards.forEach((item) => {
        const card = new Card({
            name: item.name,
            sets: item.sets
        });
        card.save((err, data) => {
            if(err){
                throw err;
            } else {
                console.log('done with one Card');
            }
        });
    });
    res.sendStatus(200);
};
