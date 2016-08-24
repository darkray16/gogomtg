const Admin = require('./modules/admin');
const module2 = require('./modules/module2');
const module3 = require('./modules/module3');
var connectTimeout = require('connect-timeout');


module.exports = (app) => {
  app.put('/putCardsInDB', Admin.putCardsInDB, connectTimeout('100000000000s'));
  app.get('/route2', module2.customMethod);
  app.get('/route3', module3.customMethod);
};
