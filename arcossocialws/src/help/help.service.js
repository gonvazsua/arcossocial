const dbConfig = require("../config/database");
const ObjectID = require('mongodb').ObjectID
const stringUtils = require('../common/string.utils');
exports.HELP_COLLECTION = "HELP";

exports.createHelp = (_id, beneficiary, helpType, date, entity, notes, user) => {
    return new Promise((resolve, reject) => {
        let help = {};
        if(_id) help._id = new ObjectID(_id);
        help.helpType = helpType;
        help.date = new Date(date);
        help.notes = notes ? stringUtils.normalize(notes) : notes;
        if(beneficiary) {
            let helpBeneficiary = {}
            helpBeneficiary.fullName = beneficiary.fullName;
            helpBeneficiary.dni = beneficiary.dni;
            helpBeneficiary.address = beneficiary.address;
            helpBeneficiary.valuationCard = beneficiary.valuationCard;
            helpBeneficiary.valuationDate = new Date(beneficiary.valuationDate);
            helpBeneficiary.creationDate = new Date(beneficiary.creationDate);
            helpBeneficiary.familySize = beneficiary.familySize;
            if(beneficiary.mate) {
                let beneficiaryMate = {}
                beneficiaryMate.fullName = beneficiary.mate.fullName;
                beneficiaryMate.dni = beneficiary.mate.dni;
                helpBeneficiary.mate = beneficiaryMate;
            }
            if(beneficiary.entity) {
                let beneficiaryEntity = {};
                beneficiaryEntity.name = beneficiary.entity.name;
                beneficiaryEntity.code = beneficiary.entity.code;
                helpBeneficiary.entity = beneficiaryEntity;
            }
            help.beneficiary = helpBeneficiary;
        }
        if(entity) {
            let helpEntity = {};
            helpEntity.name = entity.name;
            helpEntity.code = entity.code;
            help.entity = helpEntity;
        }
        if(user) {
            let helpUser = {};
            helpUser.fullName = user.fullName;
            helpUser.userCode = user.userCode;
            helpUser.entityCode = user.entityCode;
            help.user = helpUser;
        }
        resolve(help);
    })
};

exports.insertHelp = help => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection().then(db => {
            db.collection(this.HELP_COLLECTION).insertOne(help, (err, res) => {
                if(err) reject(err);
                else resolve(res.ops[0]);
            });
        });
    });
};

exports.updateHelp = help => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection().then(db => {
            const query = {$set : help};
            db.collection(this.HELP_COLLECTION).updateOne({_id:help._id}, query, (err, res) => {
                if(err) reject(err);
                else resolve(help);
            });
        });
    });
};

exports.findHelps = queryParams => {
    return new Promise((resolve, reject) => {
        const query = this.buildQuery(queryParams);
        const skip = dbConfig.calculateSkip(queryParams.pageSize, queryParams.pageNumber);
        const limit = dbConfig.calculateLimit(queryParams.pageSize);
        console.log("Query helps: " + JSON.stringify(query) + ". Skip: " + skip, " and Limit: " + limit);
        dbConfig.getConnection().then(db => {
            db.collection(this.HELP_COLLECTION).find(query).skip(skip).limit(limit).sort({'date': -1}).toArray((err, res) => {
                if(err) reject(err);
                resolve(res);
            });
        });
    });
};

exports.countHelps = queryParams => {
    return new Promise((resolve, reject) => {
        const query = this.buildQuery(queryParams);
        const skip = dbConfig.calculateSkip(queryParams.pageSize, queryParams.pageNumber);
        const limit = dbConfig.calculateLimit(queryParams.pageSize);
        dbConfig.getConnection().then(db => {
            db.collection(this.HELP_COLLECTION).count(query, (err, res) => {
                if(err) reject(err);
                resolve(res);
            });
        });
    });
};

exports.buildQuery = queryParams => {
    let andClauses = [];
    let query = null;
    if(queryParams._id) andClauses.push({'_id': new ObjectID(queryParams._id)});
    if(queryParams.beneficiaryName) andClauses.push({$or : [{'beneficiary.fullName': {$regex: stringUtils.normalize(queryParams.beneficiaryName)}}, {'beneficiary.mate.fullName': {$regex: stringUtils.normalize(queryParams.beneficiaryName)}}]});
    if(queryParams.beneficiaryDni) andClauses.push({$or : [{'beneficiary.dni': {$regex: stringUtils.normalize(queryParams.beneficiaryDni)}}, {'beneficiary.mate.dni': {$regex: stringUtils.normalize(queryParams.beneficiaryDni)}}]}); 
    if(queryParams.entityCode) andClauses.push({'entity.code': queryParams.entityCode});
    if(queryParams.helpType) andClauses.push({'helpType': queryParams.helpType});
    if(queryParams.dateFrom && !queryParams.dateTo) andClauses.push({'date' : { $gte: new Date(parseInt(queryParams.dateFrom)) } });
    if(queryParams.dateTo && !queryParams.dateFrom) andClauses.push({'date' : { $lte: new Date(parseInt(queryParams.dateFrom)) } });
    if(queryParams.dateFrom && queryParams.dateTo) {
        andClauses.push({'date' : { $gte: new Date(parseInt(queryParams.dateFrom)), $lte: new Date(parseInt(queryParams.dateTo)) }});
    }
    if(andClauses.length > 0) {
        query = {$and : andClauses};
    } else {
        query = {};
    }
    
    console.log("Searching helps: " + JSON.stringify(query));
    return query;
};