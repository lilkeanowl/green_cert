
let certificateRecords = {};

function createCertificate(stationId, firstRecord, lastRecord) {
    recordId = sendCertificate();
    certificateRecords.insert(
        {stationId: stationId, recordId: recordId, firstRecord: firstRecord,  lastRecord: lastRecord}, 
        (err, result) => {
            if (err) {
                console.log(err);
            }
        });
}

function sendCertificate() {
    //send data to b
    return "testId"
}

function isGreen(certRecordId) {
    return false;
}

module.exports = {
    init: function(mongo) {
        certificateRecords = mongo.collection('certificateRecords');
    },
    createCertificate: createCertificate
};