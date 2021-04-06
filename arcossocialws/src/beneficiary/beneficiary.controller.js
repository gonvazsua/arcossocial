const express = require('express');
const router = express.Router();
const beneficiaryService = require('./beneficiary.service');

router.get('/count', (req, res) => {
    beneficiaryService
        .countBeneficiaries(req.query)
        .then(beneficiaries => { res.jsonp(beneficiaries) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error obteniendo beneficiarios', 'reason' : err});
        });
});

router.get('/', (req, res) => {
    beneficiaryService
        .findBeneficiaries(req.query)
        .then(beneficiaries => { res.jsonp(beneficiaries) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error obteniendo beneficiarios', 'reason' : err});
        });
});

router.post('/', (req, res) => {
    beneficiaryService
        .createBeneficiary(req.body._id, req.body.fullName, req.body.dni, req.body.address, req.body.entity, req.body.valuationCard, req.body.valuationDate, req.body.creationDate, req.body.mate, req.body.familySize, req.body.isActive, req.body.uts)
        .then(beneficiaryService.insertBeneficiary)
        .then(beneficiary => { res.jsonp(beneficiary) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error insertando nuevo beneficiario', 'reason' : err});
        });
});

router.put('/', (req, res) => {
    beneficiaryService
        .createBeneficiary(req.body._id, req.body.fullName, req.body.dni, req.body.address, req.body.entity, req.body.valuationCard, req.body.valuationDate, req.body.creationDate, req.body.mate, req.body.familySize, req.body.isActive, req.body.uts)
        .then(beneficiary => beneficiaryService.updateBeneficiary(beneficiary))
        .then(beneficiary => { res.jsonp(beneficiary) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error actualizando beneficiario', 'reason' : err});
        });
});

module.exports = router;