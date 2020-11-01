const authRoutes = require("./src/auth/auth.controller");

exports.addRoutes = expressApp => {

    expressApp.use('/auth', authRoutes);
    //expressApp.use(tokenService.verifyToken);


};