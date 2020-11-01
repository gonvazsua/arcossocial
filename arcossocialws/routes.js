const authRoutes = require("./src/auth/auth.controller");
const tokenService = require("./src/config/token.service");
const entityRoutes = require("./src/entity/entity.controller");
const beneficiaryRoutes = require("./src/beneficiary/beneficiary.controller");
const helpRoutes = require("./src/help/help.controller");
const staticDataRoutes = require("./src/staticData/staticData.controller");

exports.addRoutes = expressApp => {

    //Public routes
    expressApp.use('/auth', authRoutes);

    //Token verify
    //expressApp.use(tokenService.tokenVerify);

    //Private routes
    expressApp.use('/entities', entityRoutes);
    expressApp.use('/beneficiaries', beneficiaryRoutes);
    expressApp.use('/helps', helpRoutes);
    expressApp.use('/staticData', staticDataRoutes);

};