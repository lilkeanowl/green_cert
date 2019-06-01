 const transactions = require("../transactions/transaction-manager");

 const validatorHandler = function(app) {
     app.get('/validate/:recordId', (req, res) => {
        let certRecordId = req.params.recordId;
        res.setHeader('Content-Type', 'application/json');
        transactions.findCertificate(certRecordId).then((certificate) => {
            if (!certificate.green) {
                
            } else {
                res.end(JSON.stringify({green: certificate.green}));   
            }
        }, (err) => {
            console.log(err);
            res.end(JSON.stringify({green: false}));
        });
     });
 }

 module.exports = validatorHandler;