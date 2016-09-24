const Cards = require('./modules/cards');
const PriceCheck = require('./modules/priceCheck');

module.exports = (app) => {
  app.post('/getCardsInDB', Cards.getCards);
  app.post('/priceCheck', PriceCheck.priceCheck);
};
