
let journal = {};

module.exports = {
    init: function(mongo) {
        journal = mongo.collection('energyCollectJournal');
    },
    saveEntry: saveEntry
};