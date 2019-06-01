const ledgerRoute = require('./ledger-route');
const validatorRoute = require('./validator-route');

module.exports = function(app, mongodb) {
    ledgerRoute(app, mongodb);
    validatorRoute(app);
};