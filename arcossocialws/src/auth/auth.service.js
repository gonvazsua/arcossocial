const crypto = require('crypto');
const dbConfig = require('../config/database');


exports.authenticate = (userCode, password) => {
    return new Promise((resolve, reject) => {
        const codedPassword = this.generatePassword(password);
        console.log(codedPassword);
        dbConfig.getDatabaseConn().then(db => {
            db.collection(dbConfig.USERS).findOne({'userCode': userCode, 'password':codedPassword}, (err, user) => {
                if(err) {
                    console.log(err);
                    reject('Login incorrecto');
                } else {
                    resolve(user._id);
                }
            });
        });
    });
};

exports.generatePassword = password => {
    return crypto.createHash('md5').update(this.decodeBase64(password)).digest('hex');
};

exports.decodeBase64 = encoded => {
    return Buffer.from(encoded, 'base64').toString('ascii');
};

exports.updatePassword = (userId, oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
        dbConfig.getDatabaseConn().then(db => {
            const codedOldPass = this.generatePassword(oldPassword);
            db.collection(dbConfig.USERS).findOne(dbConfig.buildParams({'_id': userId, 'password': codedOldPass}), (err, user) => {
                if(err || !user) reject('User not found');
                else {
                    user.password = this.generatePassword(newPassword)
                    db.collection(dbConfig.USERS).updateOne(dbConfig.buildParams({'_id': user._id}), user, (err, savedUser) => {
                        if(err) reject('User not found');
                        else resolve(savedUser);
                    });
                }
            });
        })
    });
};