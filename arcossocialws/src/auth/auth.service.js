const userService = require('../user/user.service');

exports.authenticate = (userCode, password) => {
    return new Promise((resolve, reject) => {
        const codedPassword = userService.generatePassword(password);
        console.log(codedPassword);
        userService.findByUserCodeAndPassword(userCode, codedPassword)
            .then(user => {
                if(user.isActive) resolve(user);
                else reject('El usuario no está activo');
            })
            .catch(err => reject(err));
    });
};

exports.register = (fullName, base64Pass, entityCode, isAdmin) => {
    return new Promise((resolve, reject) => {
        userService.create(fullName, base64Pass, entityCode, isAdmin)
            .then(user => resolve(user))
            .catch(err => resolve(err));
    });
};