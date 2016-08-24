const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const card = new Schema({
    name: { type: String, required: true },
    sets: { type: Array }
});

const cardModel = mongoose.model('card', card);

module.exports = cardModel;
