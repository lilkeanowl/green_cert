const web3 = require('web3');
const Tx = require('ethereumjs-tx');
const MongoClient = require('mongodb').MongoClient;
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'mysql',
  user     : 'root',
  password : 'passwd',
  database : 'green_certs_stat'
});

const contractABI = require('../abi.json');

const contractAddress = "0x00A57F69F41Fd07bF9e1Ba59884D488eAFA60165";

const web3js = new web3(new web3.providers.WebsocketProvider("ws://159.69.251.155:8546"));

const contract = new web3js.eth.Contract(contractABI,contractAddress);

const url = 'mongodb://mongo:27017';

MongoClient.connect(url, async function(err, client) {
	if (err) throw(err);

	const db = client.db('meteor');
	const collection = db.collection('green_certs');

	const fromBlock = await web3js.eth.getBlockNumber() - 990;

	contract.events.RecordAdded({ fromBlock }, function(err, event) {
		if (err) throw(err);
		console.log(event);
		//request.get("", event.transactionHash);
		collection.insertOne({
			_id: event.transactionHash,
			generator: event.returnValues.generator,
			number: event.returnValues.number.toString(),
			green: false,
		}, function(error) { console.log(error); });

		connection.query('insert ignore into records values(?,?,?,now())', [
				event.transactionHash, event.returnValues.generator, event.returnValues.number.toString()
			], function (error) {
				if (error) throw(error);
		});

		contract.methods.records(event.returnValues.number).call({}, function(err,res) {
                	if (err) return console.log(err);
			collection.updateOne({_id: event.transactionHash }, {
				$set: { data: {
					generator: res.generator,
					begin: res.begin.toNumber(),
					end: res.end.toNumber(),
				}}}, function(error) { console.log(error); });
        	});
	});

	contract.events.Green({ fromBlock }, function(err, event) {
		if (err) throw(err);
		collection.updateOne({number: event.returnValues.number.toString() }, {
			$set: {green: true, owner: event.returnValues.owner}
		}, function(error) { console.log(error); });

		connection.query('insert ignore into green values(?,?,?,now())', [
				event.transactionHash, event.returnValues.owner, event.returnValues.number.toString()
			], function (error) {
				if (error) throw(error);
		});
	});

	contract.events.Transfer({ fromBlock }, function(err, event) {
		if (err) throw(err);
		console.log(event);
		collection.updateOne({number: event.returnValues._tokenId.toString() }, {
			$set: { owner: event.returnValues._to }
		}, function(error) { console.log(error); });

		connection.query('insert ignore into transfers values(?,?,?,?,now())', [
				event.transactionHash, event.returnValues._tokenId.toString(),
				event.returnValues._from, event.returnValues._to
			], function (error) {
				if (error) throw(error);
		});
	});
});

