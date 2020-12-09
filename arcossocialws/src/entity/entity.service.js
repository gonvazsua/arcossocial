const dbConfig = require("../config/database");
const ObjectID = require('mongodb').ObjectID
exports.ENTITY_COLLECTION = "ENTITY";

exports.createEntity = (_id, name, code, creationDate, isActive) => {
    return new Promise((resolve, reject) => {
        let entity = {};
        if(_id) entity._id = new ObjectID(_id);
        entity.name = name;
        entity.code = code;
        entity.creationDate = creationDate ? new Date(creationDate) : new Date();
        entity.isActive = isActive;
        resolve(entity);
    });
};

exports.insertEntity = entity => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection().then(db => {
            db.collection(this.ENTITY_COLLECTION).insertOne(entity, (err, res) => {
                if(err) reject(err);
                else resolve(res.ops[0]);
            });
        });
    });
};

exports.updateEntity = entity => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection().then(db => {
            const query = {$set : entity};
            db.collection(this.ENTITY_COLLECTION).updateOne({_id:entity._id}, query, (err, res) => {
                if(err) reject(err);
                else resolve(entity);
            });
        });
    });
};

exports.findEntities = queryParams => {
    return new Promise((resolve, reject) => {
        const query = this.buildQuery(queryParams);
        const skip = dbConfig.calculateSkip(queryParams.pageSize, queryParams.pageNumber);
        const limit = dbConfig.calculateLimit(queryParams.pageSize);
        dbConfig.getConnection().then(db => {
            db.collection(this.ENTITY_COLLECTION).find(query).skip(skip).limit(limit).toArray((err, res) => {
                if(err) reject(err);
                resolve(res);
            });
        });
    });
};

exports.buildQuery = queryParams => {
    let query = {};
    if(queryParams._id) query._id = new ObjectID(queryParams._id);
    if(queryParams.code) query.code = queryParams.code;
    if(queryParams.name) query.name = queryParams.name;
    if(queryParams.isActive) query.isActive = queryParams.isActive === 'true';
    console.log("Query entities: " + JSON.stringify(query));
    return query;
};