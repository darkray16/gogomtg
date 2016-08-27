const Admin = require('./modules/admin');
const Cards = require('./modules/cards');
const TCGplayer = require('./modules/tcgPlayer');

module.exports = (app) => {
  app.put('/putCardsInDB', Admin.putCardsInDB);
  app.post('/getCardsInDB', Cards.getCards);
  app.get('/priceCheck', TCGplayer.priceCheck);  //includes card look up
};
