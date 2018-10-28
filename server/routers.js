let enterprise_account_c = require('./controllers/enterprise_account_controller');
let operations_c = require('./controllers/operations_controller');
let financial_c = require('./controllers/financial_data_controller');

module.exports = function(app) {
  app.post('/api/enterprise', enterprise_account_c.update_enterprise_account);
  app.get('/api/enterprise', enterprise_account_c.query_enterprise_account);
  app.post('/api/operations', operations_c.update_operations);
  app.get('/api/operations', operations_c.query_operations);
  app.post('/api/financial', financial_c.update_financial_data);
  app.get('/api/financial', financial_c.query_financial_data);
};
