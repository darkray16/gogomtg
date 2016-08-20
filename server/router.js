//require middlewares here for each individual route
const module1 = require('./modules/module1');
const module2 = require('./modules/module2');
const module3 = require('./modules/module3');

module.exports = function(app){
  app.get('/route1', module1.customMethod);
  app.get('/route2', module2.customMethod);
  app.get('/route3', module3.customMethod);
};
