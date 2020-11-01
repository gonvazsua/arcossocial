const dbConfig = require("../config/database");
const ObjectID = require('mongodb').ObjectID
exports.BENEFICIARY_COLLECTION = "BENEFICIARY";

exports.createBeneficiary = (_id, fullName, dni, addres, entity, valuationCard, valuationDate, creationDate, mate) => {
    return new Promise((resolve, reject) => {
        let beneficiary = {};
        if(_id) beneficiary._id = new ObjectID(_id);
        beneficiary.fullName = fullName;
        beneficiary.dni = dni;
        beneficiary.addres = addres;
        beneficiary.valuationCard = valuationCard;
        beneficiary.valuationDate = new Date(valuationDate);
        beneficiary.creationDate = new Date(creationDate);
        if(mate) {
            let beneficiaryMate = {}
            beneficiaryMate.fullName = mate.fullName;
            beneficiaryMate.dni = mate.dni;
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
            db.collection(this.BENEFICIARY_COLLECTION).find(query).skip(skip).limit(limit).toArray((err, res) => {
                if(err) reject(err);
                resolve(res);
            });
        });
    });
};

exports.buildQuery = queryParams => {
    let query = {};
    if(queryParams._id) query['_id'] = new ObjectID(queryParams._id);
    if(queryParams.fullName) query['fullName'] = new RegExp(queryParams.fullName, 'i');
    if(queryParams.dni) query['fullName'] = queryParams.dni;
    if(queryParams.addres) query['addres'] = new RegExp(queryParams.addres, 'i');
    if(queryParams.valuationCard) query['valuationCard'] = queryParams.valuationCard === 'true';
    if(queryParams.mateFullName) query['mate.fullName'] =  new RegExp(queryParams.mateFullName, 'i');
    if(queryParams.mateDni) query['mate.dni'] = queryParams.mateDni;
    if(queryParams.entityCode) query['entity.code'] = queryParams.entityCode;
    if(queryParams.entityName) query['entity.name'] = queryParams.entityName;
    console.log("Query beneficiaries: " + query);
    return query;
};