const Cards = module.exports;
const Card = require('../models/card');

Cards.getCards = (req, resp) => {
    Card.find({ name: { $regex: '^'+req.body.query, $options: 'i'}},{},{ limit: 4},(err, data) => {
    var list = [];
    console.log(data);
    for(var i = 0; i < data.length; i++) {
        var obj = {};
        obj.name = data[i].name;
        obj.sets = data[i].sets;
        list.push(obj);
    }
    resp.send(list);
});
};
