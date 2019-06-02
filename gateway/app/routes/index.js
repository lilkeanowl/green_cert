const ledgerRoute = require('./ledger-route');
const validatorRoute = require('./validator-route');

module.exports = function(app) {
    ledgerRoute(app);
    validatorRoute(app);
};