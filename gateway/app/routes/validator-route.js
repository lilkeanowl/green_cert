 const certificatesService = require("../operations/certificates-service");

 const validatorHandler = function(app) {
     app.put('/validate/:recordId', (req, res) => {
        let certRecordId = req.params.recordId;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({green: certificatesService.isGreen(certRecordId)}));
     });
 }

 module.exports = validatorHandler;