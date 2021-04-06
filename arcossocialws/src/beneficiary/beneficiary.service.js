const dbConfig = require("../config/database");
const ObjectID = require('mongodb').ObjectID
const stringUtils = require('../common/string.utils');
exports.BENEFICIARY_COLLECTION = "BENEFICIARY";

exports.createBeneficiary = (_id, fullName, dni, address, entity, valuationCard, valuationDate, creationDate, mate, familySize, isActive, uts) => {
    return new Promise((resolve, reject) => {
        let beneficiary = {};
        if(_id) beneficiary._id = new ObjectID(_id);
        beneficiary.fullName = fullName ? stringUtils.normalize(fullName) : fullName;
        beneficiary.dni = dni ? stringUtils.normalize(dni) : dni;
        beneficiary.address = address ? stringUtils.normalize(address) : address;
        beneficiary.valuationCard = valuationCard;
        beneficiary.valuationDate = new Date(valuationDate);
        beneficiary.creationDate = new Date(creationDate);
        beneficiary.familySize = familySize;
        beneficiary.isActive = isActive;
        beneficiary.uts = uts
        if(mate) {
            let beneficiaryMate = {}
            beneficiaryMate.fullName = mate.fullName ? stringUtils.normalize(mate.fullName) : mate.fullName;
            beneficiaryMate.dni = mate.dni ? stringUtils.normalize(mate.dni) : mate.dni;
            beneficiary.mate = beneficiaryMate;
        }
        if(entity) {
            let beneficiaryEntity = {};
            beneficiaryEntity.name = entity.name;
            beneficiaryEntity.code = entity.code;
            beneficiary.entity = beneficiaryEntity;
        }
        resolve(beneficiary);
    })
};

exports.insertBeneficiary = beneficiary => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection().then(db => {
            db.collection(this.BENEFICIARY_COLLECTION).insertOne(beneficiary, (err, res) => {
                if(err) reject(err);
                else resolve(res.ops[0]);
            });
        });
    });
};

exports.updateBeneficiary = beneficiary => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection().then(db => {
            const query = {$set : beneficiary};
            db.collection(this.BENEFICIARY_COLLECTION).updateOne({_id:beneficiary._id}, query, (err, res) => {
                if(err) reject(err);
                else resolve(beneficiary);
            });
        });
    });
};

exports.findBeneficiaries = queryParams => {
    return new Promise((resolve, reject) => {
        const query = this.buildQuery(queryParams);
        const skip = dbConfig.calculateSkip(queryParams.pageSize, queryParams.pageNumber);
        const limit = dbConfig.calculateLimit(queryParams.pageSize);
        dbConfig.getConnection().then(db => {
            db.collection(this.BENEFICIARY_COLLECTION).find(query).skip(skip).limit(limit).sort({'creationDate': -1}).toArray((err, res) => {
                if(err) reject(err);
                resolve(res);
            });
        });
    });
};

exports.countBeneficiaries = queryParams => {
    return new Promise((resolve, reject) => {
        const query = this.buildQuery(queryParams);
        dbConfig.getConnection().then(db => {
            db.collection(this.BENEFICIARY_COLLECTION).count(query, (err, res) => {
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
    if(queryParams.fullName) andClauses.push({$or : [{'fullName': {$regex: stringUtils.normalize(queryParams.fullName)}}, {'mate.fullName': {$regex: stringUtils.normalize(queryParams.fullName)}}]});
    if(queryParams.dni) andClauses.push({$or : [{'dni': {$regex: stringUtils.normalize(queryParams.dni)}}, {'mate.dni': {$regex: stringUtils.normalize(queryParams.dni)}}]});
    if(queryParams.address) andClauses.push({'address': {$regex: stringUtils.normalize(queryParams.address)}}); 
    if(queryParams.valuationCard) andClauses.push({'valuationCard': queryParams.valuationCard === 'true' ? true : false});
    if(queryParams.isActive) andClauses.push({'isActive': queryParams.isActive === 'true' ? true : false});
    //if(queryParams.mateFullName) query['mate.fullName'] =  {$regex: queryParams.mateFullName};
    //if(queryParams.mateDni) query['mate.dni'] = queryParams.mateDni;
    if(queryParams.entityCode) andClauses.push({'entity.code': queryParams.entityCode});
    if(queryParams.entityName) andClauses.push({'entity.name': queryParams.entityName});
    
    if(andClauses.length > 0) {
        query = {$and : andClauses};
    } else {
        query = {};
    }
    console.log("Query beneficiaries: " + JSON.stringify(query));
    return query;
};