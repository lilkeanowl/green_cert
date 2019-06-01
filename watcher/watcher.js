const web3 = require('web3');
const Tx = require('ethereumjs-tx');
const MongoClient = require('mongodb').MongoClient;

const contractABI = require('./abi.json');

const contractAddress ="0x024E8be99d7358f17A8aE6aaE75FaC93058ec543";

const web3js = new web3(new web3.providers.WebsocketProvider("ws://159.69.251.155:8546"));

const contract = new web3js.eth.Contract(contractABI,contractAddress);

const url = 'mongodb://localhost:27017';

MongoClient.connect(url, async function(err, client) {
	if (err) throw(err);

	const db = client.db('meteor');
	const collection = db.collection('green_certs');

	const fromBlock = await web3js.eth.getBlockNumber() - 990;

	contract.events.RecordAdded({ fromBlock }, function(err, event) {
		if (err) throw(err);
		//request.get("", event.transactionHash);
		collection.insertOne({
			_id: event.transactionHash,
			generator: event.returnValues.generator,
			number: event.returnValues.number.toString(),
			green: false,
		}, function(error) { console.log(error); });
	});
			

	contract.events.Green({ fromBlock }, function(err, event) {
		if (err) throw(err);
		collection.updateOne({number: event.returnValues.number.toString() }, {
			green: true,
		}, function(error) { console.log(error); });
	});
});

