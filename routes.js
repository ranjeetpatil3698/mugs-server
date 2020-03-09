const user = require("./controller/user")
const grievance = require("./controller/grievance")
const utility = require("./services/utility")
const validation = require("./services/validation")
const validate = require('express-validation');
const {uploads} = require('./multer/upload_file')



module.exports = function(app, express) {
    var apiRoutes = express.Router();
    apiRoutes.get("/check", (req, res) => {
        return res.json({ message: "Api is fully functional" })
    })

    //*********************** Auth Routes *************************//
    apiRoutes.post("/register", validate(validation.register), user.register)
    apiRoutes.get("/verify/:id",user.verify)
    apiRoutes.post("/grievance/add", utility.authenticateMiddleware, uploads.array('documents',10),grievance.addGrievance)

    apiRoutes.post("/committee/register", user.registerCommittee)
    

    apiRoutes.post("/committee/register", user.registerCommittee)




    // apiRoutes.post("/login", validate(validation.login), controller.user.login)


    app.use('/api', apiRoutes);
    app.use(function(err, req, res, next) {
        res.status(400).json(err);
    });
}