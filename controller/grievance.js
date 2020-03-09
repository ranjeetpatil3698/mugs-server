const { uploads } = require('../multer/upload_file')
const grievanceModel  = require('../model/grievance')


module.exports.addGrievance = (req, res) => {
    const fs = require('fs')
    if (req.decoded.userType === 'student') {
        const email = req.decoded.email;
        grievanceModel.collection.countDocuments({ from: email }, (err, count) => {
            const path = "./Multer/uploads/" + email.split('@')[0] + '/grievance' + String(count + 1);
            fs.readdir(path, (err, files) => {
                const all_files_path = []
                files.forEach(file => {
                    all_files_path.push(path + '/' + file)
                })
                const object = {
                    title: req.body.title,
                    from: email,
                    documents: all_files_path,
                    status: -1,
                    description: req.body.description,
                    timestamp: Math.floor(Date.now() / 1000)
                }
                grievanceModel(object).save(() => { console.log("Grievance added!"); })
            })
        })
    }
    else {
        return res.send("unauthorized")
    }
    res.send("File Loaded successfully")

}