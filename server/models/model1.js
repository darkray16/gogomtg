const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model1 = new Schema({
  attribute1: { type: String, required: true },
  attribute2: { type: Date, default: Date.now }
});

const MongooseModel = mongoose.model('oneRow', model1);

module.exports = MongooseModel;
