const  grievanceModel = require('../model/grievance')
const multer = require('multer')
const fs = require('fs')



const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const email_id = req.decoded.email;
        const directory = __dirname + '/uploads/' + email_id
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory)
        }

        grievanceModel.collection.countDocuments({ from: email_id}, (err, count) => {
            console.log(count)
            const directory = __dirname + '/uploads/' + email_id + '/grievance' + String(count + 1);
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory)
                cb(null, directory)
            }
            else {
                cb(null, directory)
            }
        })


    },
    filename: async function (req, file, cb) {
        // console.log(file.originalname)
        await cb(null, file.originalname + '-' + Date.now())
    }
})


const uploads = multer({ storage: storage })
module.exports = { uploads }