const authRoutes = require("./src/auth/auth.controller");
const tokenService = require("./src/config/token.service");

exports.addRoutes = expressApp => {

    //Public routes
    expressApp.use('/auth', authRoutes);

    //Token verify
    expressApp.use(tokenService.tokenVerify);

    //Private routes
    


};