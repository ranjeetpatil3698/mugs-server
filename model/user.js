const mongoose = require('mongoose');


const studentSchema = mongoose.Schema({
    name: String,
    email: String,
    mobile: Number,
    college: String,
    rollNo: String,
    gender: String,
    password: String,
    type: String,
    isVerified: Number,
    userType: String
});

// const secretarySchema = mongoose.Schema({
//     name: String,
//     email: String,
//     password: String,
//     mobile: Number,
//     userType: String
// });

const officialsSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    imageUrl: String,
    designation: String,
    college: String,
    userType: String
});


const studentModel = mongoose.model("Student", studentSchema)
const officialsModel = mongoose.model("Officials", officialsSchema)

module.exports = {
    studentModel, officialsModel
};