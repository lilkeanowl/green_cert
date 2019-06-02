const transactions = require("../transactions/transaction-manager");

 const validatorHandler = function(app) {
     app.get('/validate/:recordId', (req, res) => {
        let certRecordId = req.params.recordId;
        res.setHeader('Content-Type', 'application/json');
        transactions.findCertificate(certRecordId, (certificate) => {
            console.log("Found certificate: ", certificate);
            if (!certificate) {
                res.end(JSON.stringify({green: false}));   
                return;
            }
            if (!certificate.green) {
                //validation
                transactions.validateCertificate(certificate.stationId, certificate.recordId, (green) => {
                    res.end(JSON.stringify({green: green}));   
                });
            } else {
                res.end(JSON.stringify({green: certificate.green}));   
            }
        });
     });
 }

 module.exports = validatorHandler;