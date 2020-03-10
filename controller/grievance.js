const { studentModel } = require('../model/user')
const grievanceModel = require('../model/grievance')
const moment = require('moment')
const { v4 } = require("uuid");
const fs = require("fs");
const utility = require("../services/utility");


module.exports.addGrievance = async (req, res) => {
    const path = require("path");
    var email_id = req.decoded.email
    if (req.decoded.userType === 'student') {
        grievanceModel.collection.countDocuments({ from: email_id }, (err, count) => {
            const { fieldname, originalname, encoding, mimetype, buffer } = req.files[0];
            if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
                return res.status(400).json({ error: "Wrong file type submitted" });
            }
            try {
                const imageExtension = originalname.split(".")[
                    originalname.split(".").length - 1
                ];
                let local = './uploads'
                const imageFileName = `${v4()}.${imageExtension}`;
                const filepath = path.join(local, imageFileName)
                console.log(filepath)
                fs.writeFileSync(filepath, buffer)
                studentModel.findOne({ email: email_id }, function (err, data) {
                    const object = {
                        title: req.body.title,
                        from: email_id,
                        author: data,
                        subtitle: req.body.subtitle,
                        documents: "http://localhost:2000/images/" + imageFileName,
                        status: -1,
                        description: req.body.description,
                        timestamp: new Date().getTime(),
                        alloted_on: null,
                        solved_on: null,

                    }
                    grievanceModel(object).save((data) => {
                        return res.send(data)
                    })
                })

            }
            catch (err) {
                res.send(err)
            }

        })
    }
    else {
        return res.send("unauthorized")
    }
}


module.exports.grievances = async (req, res) => {
    try {
        if (req.decoded.userType === "secretary") {
            var grievances = await grievanceModel.find({ $or: [{ status: -1 }, {status: -2}] }).sort({ 'timestamp': 'asc' })
            res.json({ grievances, msg: 'Grievances fetched succesfully' })
        }
        res.send('not authorized')
    }
    catch (err) {
        res.status(400).send({
            error: 'Could not fetch grievances'
        })
    }
}

module.exports.selected_grievances = async (req, res) => {
    try {
        if (req.decoded.userType === "secretary") {
            var grievances_status_0 = await grievanceModel.find({ status: 0 }).sort({ 'timestamp': 1 })
            res.json(grievances_status_0)
        }
    }
    catch (err) {
        res.status(400).send({
            error: 'Could not fetch grievances which are under process'
        })
    }
}

module.exports.underprocess_grievances = async (req, res) => {
    try {
        if (req.decoded.userType === "secretary") {
            var grievances_status_0 = await grievanceModel.find({ status: 1 }).sort({ 'timestamp': 1 })
            res.json(grievances_status_0)
        }
    }
    catch (err) {
        res.status(400).send({
            error: 'Could not fetch grievances which are under process'
        })
    }
}


module.exports.deselect_grievance = async (req, res) => {
    const { grievanceId } = req.body;
    try {
        if (req.decoded.userType === "secretary") {
            grievance = await grievanceModel.updateOne({ _id: grievanceId }, { $set: { "status": -1 } })
            res.send('deselected' + grievanceId)
        }
    }
    catch (err) {
        res.status(400).send({
            error: 'Could not fetch grievances which are under process'
        })
    }
}


module.exports.select_grievance = async (req, res) => {
    const { grievanceId } = req.body;
    try {
        if (req.decoded.userType === "secretary") {
            grievance = await grievanceModel.updateOne({ _id: grievanceId }, { $set: { "status": 0 } })
            res.send('selected' + grievanceId)
        }
    }
    catch (err) {
        res.status(400).send({
            error: 'Could not fetch grievances which are under process'
        })
    }
}

module.exports.allocate_date = async (req, res) => {
    const { grievanceId, alloted_date, email, date } = req.body;
    try {
        if (req.decoded.userType === "secretary") {
            grievance = await grievanceModel.updateOne({ _id: grievanceId }, { $set: { "alloted_on": alloted_date , "status": 1} })
            try{
                console.log(email)
                const mssg = {
                    to: email,
                    from: 'vnnair39@gmail.com',
                    subject: 'Your Grievance is under Evaluatuion by the board',
                    text: 'The board has allocated date ' + date + ' to resolve your grievance.',
                    // html: tag
                }
                utility.mail(mssg)
            }catch(err){
                console.log(err)
            }
            res.send('selected' + grievanceId)
        }
    }
    catch (err) {
        res.status(400).send({
            error: 'Could not fetch grievances which are under process'
        })
    }
}


module.exports.reject = async (req, res) => {
    const { grievanceId, email} = req.body;
    try {
        if (req.decoded.userType === "secretary") {
            grievance = await grievanceModel.deleteOne({ _id: grievanceId })
            const mssg = {
                to: email,
                from: 'vnnair39@gmail.com',
                subject: 'Your Grievance has been rejected by the board',
                text: "The board either found the grievance to be irrelavant or something that the board couldn't solve",
                // html: "<h3></h3>"
            }
            utility.mail(mssg)
            res.send('deleted' + grievanceId)
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).send({
            error: 'Could not fetch grievances which are under process'
        })
    }
}