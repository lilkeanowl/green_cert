const web3 = require('web3');
const Tx = require('ethereumjs-tx');

const contractABI = require('../../../abi.json');

//should be unique for each energy provider
const defaultPK = Buffer.from('5f612cb61d0f9a028620490eb7aed26888531f965452feb1eeec8c3f12a07c81', 'hex')
const defaultMyAddress = "0x66131Cc548B724B6cF21Fe2771850034a906A33C";

const contractAddress = require('../../../consts.json').contractAddress;
const validate = require('./validatior');

const web3js = new web3(new web3.providers.HttpProvider("http://159.69.251.155:8545"));
const contract = new web3js.eth.Contract(contractABI, contractAddress);

let certificateRecords = {};
let journal = {};

function createCertificate(stationId, firstRecordTimestamp, lastRecordTimestamp) {
    //load theese from db
    privateKey = defaultPK;
    agentAddress = defaultMyAddress;
    addRecord(stationId, firstRecordTimestamp, lastRecordTimestamp, privateKey, agentAddress);
}

function findCertificate(recordId, callback) {
    return certificateRecords.findOne({recordId: recordId}, (err, doc) => {
        if (err) {
            console.log(err);
        }
        callback(doc);
    });
}

function addRecord(stationId, firstRecordTimestamp, lastRecordTimestamp, privateKey, agentAddress) {
    web3js.eth.getTransactionCount(agentAddress).then(function (count) {
        let rawTransaction = {
            "from": agentAddress,
            "gasPrice": web3js.utils.toHex(4 * 1e9),
            "gasLimit": web3js.utils.toHex(2100000),
            "to": contractAddress,
            "value": "0x0",
            "data": contract.methods.addRecord(firstRecordTimestamp, lastRecordTimestamp).encodeABI(),
            "nonce": web3js.utils.toHex(count)
        };
        let transaction = new Tx(rawTransaction);
        transaction.sign(privateKey);
        web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), function (err, result) {
            if (err) {
                console.log('Error', err);
            }
            console.log('TX', result);
            saveRecord(stationId, result, firstRecordTimestamp, lastRecordTimestamp);
            validateCertificate(stationId, result, lastRecordTimestamp, (green) => { 
                console.log("Certificate " + result + " is green: " + green);
            });
        });
    });
}

function saveRecord(stationId, recordId, firstRecord, lastRecord, green = false) {
    certificateRecords.insert(
        { stationId: stationId, recordId: recordId, firstRecord: firstRecord, lastRecord: lastRecord, green: green},
        (err, result) => {
            if (err) {
                console.log(err);
            }
        });
}

function validateCertificate(stationId, recordId, lastRecord, callback) {
    console.log(stationId);
    console.log(recordId);
    //should be contraint by timestamp
    journal.find({id: stationId, timestamp: {$lte: lastRecord}}).toArray((err, items) => {
        if (err) {
            console.log("An error occured ", err);
        }
        let green = validate(items);
        certificateRecords.updateOne({recordId: recordId}, {$set: {green: green}});
        callback(green);
    });
}

module.exports = {
    init: function (mongo) {
        certificateRecords = mongo.collection('certificateRecords');
        journal = mongo.collection('energyCollectJournal');
    },
    createCertificate: createCertificate,
    findCertificate: findCertificate,
    validateCertificate: validateCertificate
}