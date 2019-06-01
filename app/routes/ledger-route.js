const aggregationsHandler = require('../operations/aggregations-service');

const ledgerHandler = function(app, db) {
    app.post('/ledger', (req, res) => {
        body = req.body;
        console.log(body);
        saveData(body, db);

        res.set(200);
        res.end();
    });
}

function saveData(data, db) {
    console.log(db);
    db.collection('energyCollectJournal').insert(data, (err, result) => {
        if (err) { 
            console.log("An error occured ", err);
        }
    });
    if (Array.isArray(data)) {
        data.forEach((entry) => {
            aggregationsHandler.sendTransactionRecord(entry.id, entry.pwr_avg, entry.timestamp);
        });
    } else {
        aggregationsHandler.sendTransactionRecord(data.id, data.pwr_avg, data.timestamp);
    }
    
}

module.exports = ledgerHandler;
