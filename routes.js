const user = require("./controller/user")
const grievance = require("./controller/grievance")
const utility = require("./services/utility")
const validation = require("./services/validation")
const validate = require('express-validation');
const fileParser = require('express-multipart-file-parser')



module.exports = function (app, express) {
    var apiRoutes = express.Router();
    apiRoutes.get("/check", (req, res) => {
        return res.json({ message: "Api is fully functional" })
    })

    //*********************** Auth Routes *************************//
    apiRoutes.post("/register", validate(validation.register), user.register)
    apiRoutes.post("/login", validate(validation.login), user.login)
    apiRoutes.get("/verify/:id", user.verify)
    apiRoutes.post("/grievance/add", utility.authenticateMiddleware, fileParser, grievance.addGrievance)
    apiRoutes.get("/grievances", utility.authenticateMiddleware, grievance.grievances)
    apiRoutes.get("/grievances/selected", utility.authenticateMiddleware, grievance.selected_grievances)
    apiRoutes.get("/grievances/process", utility.authenticateMiddleware, grievance.underprocess_grievances)
    apiRoutes.post("/grievance/deselect", utility.authenticateMiddleware, grievance.deselect_grievance)
    apiRoutes.post("/grievance/select", utility.authenticateMiddleware, grievance.select_grievance)
    apiRoutes.post("/grievance/date", utility.authenticateMiddleware, grievance.allocate_date)
    apiRoutes.post("/grievance/reject", utility.authenticateMiddleware, grievance.reject)



    apiRoutes.post("/committee/register", user.registerCommittee)


    apiRoutes.post("/committee/register", user.registerCommittee)




    // apiRoutes.post("/login", validate(validation.login), controller.user.login)


    app.use('/api', apiRoutes);
    app.use(function (err, req, res, next) {
        res.status(400).json(err);
    });
}