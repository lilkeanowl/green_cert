const aggregationsHandler = require('../operations/aggregations-service');
const journal = require('../operations/journal-service');

const ledgerHandler = function (app) {
    app.post('/ledger', (req, res) => {
        body = req.body;
        console.log(body);
        saveData(body);

        res.set(200);
        res.end();
    });
}

function saveData(data) {
    journal.saveEntry(data);
    sendTransactionRecord(data);
}

function sendTransactionRecord(data) {
    if (Array.isArray(data)) {
        data.forEach((entry) => {
            aggregationsHandler.sendTransactionRecord(entry.id, entry.pwr_avg, entry.timestamp);
        });
    } else {
        aggregationsHandler.sendTransactionRecord(data.id, data.pwr_avg, data.timestamp);
    }
}

module.exports = ledgerHandler;
