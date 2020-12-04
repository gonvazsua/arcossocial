const crypto = require('crypto');
const dbConfig = require('../config/database');
const stringUtils = require('../common/string.utils');
exports.USER_COLLECTION = "USER";

exports.findByUserCodeAndPassword = (userCode, password) => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection().then(db => {
            db.collection(this.USER_COLLECTION).findOne({'userCode': userCode, 'password':password, 'isActive': true}, (err, user) => {
                if(err) {
                    console.log(err);
                    reject('User not found by userCode');
                } else {
                    resolve(user);
                }
            });
        });
    });
}

exports.generatePassword = password => {
    return crypto.createHash('md5').update(this.decodeBase64(password)).digest('hex');
};

exports.decodeBase64 = encoded => {
    return Buffer.from(encoded, 'base64').toString('ascii');
};

exports.create = (fullName, base64Pass, entityCode, isAdmin) => {
    return new Promise((resolve, reject) => {
        this.createUserCode(entityCode)
            .then(userCode => {
                const password = this.generatePassword(base64Pass);
                this.saveUser(userCode, fullName, password, entityCode, isAdmin, true, new Date())
                    .then(user => resolve(user))
                    .catch(err => reject(err));
            })
            .catch(err => resolve(err));
    });
};

exports.createUserCode = entityCode => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection()
            .then(db => {
                const entityCodeUpper = stringUtils.normalize(entityCode);
                db.collection(this.USER_COLLECTION).countDocuments({entityCode: entityCodeUpper}, (err, counter) => {
                    if(err) reject(err);
                    const zerosCounter = new String(counter).padStart(3, '0');
                    resolve(entityCodeUpper + zerosCounter);
                });
            });
    });
};

exports.saveUser = (userCode, fullName, password, entityCode, isAdmin, isActive, creationDate) => {
    return new Promise((resolve, reject) => {
        this.findByUserCodeAndPassword(userCode, password)
            .then(user => {
                if(user) reject('User already exists in database');
                dbConfig.getConnection().then(db => {
                    const userToSave = {
                        userCode: userCode,
                        fullName: fullName,
                        password: password,
                        entityCode: entityCode,
                        isAdmin: isAdmin,
                        isActive : isActive,
                        creationDate: creationDate
                    };
                    db.collection(this.USER_COLLECTION).insertOne(userToSave, (err, res) => {
                        if(err) reject(err);
                        else {
                            resolve(res.ops[0]);
                        }
                    });
                });
            })
            .catch(err => reject(err));
    });
};

exports.findUsers = queryParams => {
    return new Promise((resolve, reject) => {
        const query = this.buildQuery(queryParams);
        const skip = dbConfig.calculateSkip(queryParams.pageSize, queryParams.pageNumber);
        const limit = dbConfig.calculateLimit(queryParams.pageSize);
        dbConfig.getConnection().then(db => {
            db.collection(this.USER_COLLECTION).find(query).skip(skip).limit(limit).toArray((err, res) => {
                if(err) reject(err);
                resolve(res);
            });
        });
    });
};

exports.countUsers = queryParams => {
    return new Promise((resolve, reject) => {
        const query = this.buildQuery(queryParams);
        dbConfig.getConnection().then(db => {
            db.collection(this.USER_COLLECTION).count(query, (err, res) => {
                if(err) reject(err);
                resolve(res);
            });
        });
    });
};

exports.buildQuery = queryParams => {
    let andClauses = [];
    let query = {};
    if(queryParams.userCode) andClauses.push({'userCode': stringUtils.normalize(queryParams.userCode)});
    if(queryParams.fullName) andClauses.push({'fullName': {$regex: stringUtils.normalize(queryParams.fullName)}});
    if(queryParams.entityCode) andClauses.push({'entityCode': stringUtils.normalize(queryParams.entityCode)});
    if(queryParams.isAdmin) andClauses.push({'isAdmin': queryParams.isAdmin === 'true'});
    if(queryParams.isActive) andClauses.push({'isActive': queryParams.isActive === 'true'});

    if(andClauses.length > 0) {
        query = {$and : andClauses};
    } else {
        query = {};
    }
    console.log("Query users: " + JSON.stringify(query));

    return query;
};

exports.buildUser = (_id, userCode, fullName, base64Password, entityCode, isAdmin, isActive, creationDate) => {
    return new Promise((resolve, reject) => {
        let user = {};
        if(_id) user._id = new ObjectID(_id);
        user.fullName = fullName ? stringUtils.normalize(fullName) : fullName;
        user.userCode = userCode ? stringUtils.normalize(userCode) : userCode;
        user.password = base64Password;
        user.entityCode = entityCode ? stringUtils.normalize(entityCode) : entityCode;
        user.isAdmin = isAdmin === 'true';
        user.isActive = isActive === 'true';
        user.creationDate = new Date(creationDate);
        resolve(user);
    })
};

exports.updateUser = (user) => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection().then(db => {
            const query = {$set : user};
            db.collection(this.USER_COLLECTION).updateOne({_id:user._id}, query, (err, res) => {
                if(err) reject(err);
                else resolve(user);
            });
        });
    });
}