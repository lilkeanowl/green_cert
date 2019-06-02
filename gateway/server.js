const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const routes = require('./app/routes');

//constructors
const aggregations = require('./app/operations/aggregations-service').init;
const journal = require('./app/operations/journal-service').init;
const transactions = require('./app/transactions/transaction-manager').init;

const port = process.env.PORT || 8080;
const dbUrl = process.env.MONGO || "mongodb://localhost:27017";

const app = express();
const options = {};
app.use(express.json());

console.log(dbUrl);

MongoClient.connect(dbUrl, {}, (err, client) => {
    if (err) {
        if (err) throw err;
    }
    mongodb = client.db("green_cert");
    routes(app);
    services(mongodb);
    app.listen(port, () => {
      console.log('Listening on port ' + port);
    });
});

function services(mongodb) {
    aggregations(mongodb);
    journal(mongodb);
    transactions(mongodb);
}