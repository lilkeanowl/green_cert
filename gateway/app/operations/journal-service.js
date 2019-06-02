let journal = {};

module.exports = {
    init: function(mongo) {
        journal = mongo.collection('energyCollectJournal');
    },
    saveEntry: saveEntry,
    journal: journal
};

function saveEntry(energyRecord) {
    journal.insert(energyRecord, (err, result) => {
        if (err) { 
            console.log("An error occured ", err);
        }
    });
}