const crypto = require('crypto');
const dbConfig = require('../config/database');
exports.USER_COLLECTION = "USER";

exports.findByUserCodeAndPassword = (userCode, password) => {
    return new Promise((resolve, reject) => {
        dbConfig.getConnection().then(db => {
            db.collection(this.USER_COLLECTION).findOne({'userCode': userCode, 'password':password}, (err, user) => {
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
                const entityCodeUpper = entityCode.toUpperCase();
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