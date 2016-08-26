const Admin = require('./modules/admin');
const Cards = require('./modules/cards');
const module3 = require('./modules/module3');

module.exports = (app) => {
  app.put('/putCardsInDB', Admin.putCardsInDB);
  app.post('/getCardsInDB', Cards.getCards);
  app.get('/route3', module3.customMethod);
};
