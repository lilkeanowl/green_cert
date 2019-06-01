const certificateService = require("./certificates-service");

let aggregationRecords = {};
const ENERGY_THRESHOLD = 1000;

function sendTransactionRecord(stationId, collected, timestamp) {
    aggregationRecords.findOne({stationId: stationId}, (err, document) => {
        if (!document) {
            insertAggregationData(stationId, collected, timestamp);
        } else {
            let collectionSum = collected + document.collected;
            let firstCollection = document.firstCollection;
            while (collectionSum >= ENERGY_THRESHOLD) {
                certificateService.createCertificate(document.stationId, document.firstCollection, timestamp);
                collectionSum = collectionSum - ENERGY_THRESHOLD;
                firstCollection = timestamp;
            }
            updateAggregationData(stationId, collectionSum, firstCollection, timestamp);
        }
    });
}

function insertAggregationData(stationId, collected, timestamp) {
    aggregationRecords.insertOne(
        {stationId: stationId, collected: collected, firstCollection: timestamp, lastCollection: timestamp}, 
        (err, result) => {
        if (err) {
            console.log(err);
        }
    });
}

function updateAggregationData(stationId, collected, firstCollection, lastCollection) {
    aggregationRecords.updateOne(
        {stationId: stationId},  
        {$set: {collected: collected, firstCollection: firstCollection, lastCollection: lastCollection}},
        (err, result) => {
            if (err) {
                console.log(err);
            }
        });
}

module.exports = {
    init: function(mongo) {
        aggregationRecords = mongo.collection('aggregationRecords');
    },
    sendTransactionRecord: sendTransactionRecord
}