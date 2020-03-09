const { studentModel, officialsModel } = require("../model/user")
const utility = require("../services/utility");

// student Auth
module.exports.register = (req, res) => {
    let { name, college, rollNo, mobile, email, gender, password } = req.body;
    studentModel.findOne({ email }, (error, response) => {
        if (error) {
            return res.status(400).json({ message: "error occurred", error: error })
        } else if (response) {
            const mssg = {
                to: req.body.email,
                from: 'vnnair39@gmail.com',
                subject: 'Verification for Mugs',
                text: 'A verification Link was already sent',
                html: '<strong>Mugs Verification</strong>'
            }
            utility.mail(mssg)
            return res.status(200).json({ message: "user already exist with same email id", response: response })
        } else {
            utility.hash(password, (error, hash) => {
                password = hash
                let user = {
                    name,
                    college,
                    mobile,
                    gender,
                    rollNo,
                    email,
                    password,
                    userType: 'student',
                    isVerified: 0
                };
                studentModel.create(user, (error, response) => {
                    if (error) {
                        return res.status(400).json({ message: "error occurred", error: error })
                    } else if (response) {
                        const object_id = response["_id"];
                        const path = "http://localhost:2000/api/verify/" + object_id
                        const tag = "<a href='" + path + "'>Click this link to verify your email. </a>"
                        const mssg = {
                            to: req.body.email,
                            from: 'vnnair39@gmail.com',
                            subject: 'Account Confirmation for VinayNair',
                            text: 'Click the given link to verify your email',
                            html: tag
                        }
                        utility.mail(mssg)
                        return res.status(201).json({ message: "verification sent" })
                    }
                })
            })
        }
    })
}


module.exports.verify = (req, res) => {
    studentModel.findByIdAndUpdate({ "_id": req.params.id }, { "isVerified": 1 }, (err, data) => { console.log("Verify ho gaya") })
    res.redirect('http://localhost:3000/login')
}

module.exports.login = (req, res) => {
    let check = {
        email: req.body.email
    }
    officialsModel.findOne(check, (error, response) => {
        if (error) {
            return res.status(400).json({ message: "error occurred", error: error })
        } else if (response) {
            utility.check(req.body.password, response.password, (error, match) => {
                if (match) {
                    let payload = {
                        email: req.body.email,
                        userType: response.userType,
                        user_id: response._id
                    }
                    let token = utility.jwtToken(payload)
                    return res.status(200).json({ message: "user found token sent", token: token, userType: response.userType })
                }
            })
        }
        else {
            studentModel.findOne(check, (error, response) => {
                if (error) {
                    return res.status(400).json({ message: "error occurred", error: error })
                } else if (response) {
                    utility.check(req.body.password, response.password, (error, match) => {
                        if (match) {
                            if (response.isVerified) {
                                let payload = {
                                    email: req.body.email,
                                    userType: response.userType,
                                    user_id: response._id
                                }
                                let token = utility.jwtToken(payload)
                                return res.status(200).json({ message: "user found token sent", token: token, userType: response.userType })
                            } else {
                                return res.status(403).json({ message: "user not verified" })
                            }
                        } else {
                            return res.status(404).json({ message: "Invalid email or password" })
                        }
                    })
                } else {
                    return res.status(404).json({ message: "Invalid email or password" })
                }
            });
        }
    });
}

// Student Auth ends



// Committee Auth Starts


module.exports.registerCommittee = (req, res) => {
    let { name, email, mobile, password, designation, college } = req.body;
    officialsModel.findOne({ email }, (error, response) => {
        if (error) {
            return res.status(400).json({ message: "error occurred", error: error })
        } else if (response) {
            return res.status(200).json({ message: "user already exist with same email id", response: response })
        } else {
            utility.hash(password, (error, hash) => {
                password = hash
                let user = {
                    name,
                    college,
                    mobile,
                    designation,
                    email,
                    password,
                    userType: 'committee',
                };
                officialsModel.create(user, (error, response) => {
                    if (error) {
                        return res.status(400).json({ message: "error occurred", error: error })
                    } else if (response) {
                        return res.status(200).json({ message: "Registered " + response.name })
                    }
                })
            })
        }
    })
}