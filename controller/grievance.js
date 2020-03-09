const { uploads } = require('../multer/upload_file')
const { studentModel } = require('../model/user')
const grievanceModel = require('../model/grievance')
const moment = require('moment')
const { v4 } = require("uuid");
const fs = require("fs");


module.exports.addGrievance = async (req, res) => {
    const path = require("path");
    var email_id = req.decoded.email
    if (req.decoded.userType === 'student') {
        grievanceModel.collection.countDocuments({ from: email_id }, (err, count) => {
            const local = "./multer/uploads/" + email_id.split('@')[0] + '/grievance' + String(count + 1);
            console.log(local)
            const { fieldname, originalname, encoding, mimetype, buffer } = req.files[0];
            if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
                return res.status(400).json({ error: "Wrong file type submitted" });
            }
            try {
                const imageExtension = originalname.split(".")[
                    originalname.split(".").length - 1
                ];
                const imageFileName = `${v4()}.${imageExtension}`;
                const filepath = path.join(local, imageFileName)
                if (!fs.existsSync(local)) {
                    fs.mkdirSync(local, { recursive: true })
                }
                fs.writeFileSync(filepath, buffer)
                const files = fs.readdirSync(local);
                let all_files_path = []
                files.forEach(file => {
                    all_files_path.push(local + '/' + file)
                })
                studentModel.findOne({ email: email_id }, function (err, data) {
                    const object = {
                        title: req.body.title,
                        from: email_id,
                        author: data,
                        subtitle: req.body.subtitle,
                        documents: all_files_path,
                        status: -1,
                        description: req.body.description,
                        timestamp: new Date().getTime()
                    }
                    grievanceModel(object).save((data) => {
                        return res.send(data)
                    })
                })

            }
            catch (err) {
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
            var grievances = await grievanceModel.find({}).sort({ 'timestamp': 'asc' })
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