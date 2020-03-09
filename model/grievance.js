const mongoose = require('mongoose');


const grievanceSchema = mongoose.Schema({
    title: String,
    documents: Array,
    from: String, 
    author: Object,   // This is email_id of Student who raises grievance
    status: Number,  // Either -1/0/1  
    description: String,  // This is message enclosed in grievance
    suggestion: Array,  // This is array of suggestion which comprises of comments by committee members
    /* 
        [{
            comment:String,
            by:String,        // mail id of committee member who comments
            timestamp:Date
        },{},...]
    */
    timestamp: Date

});


module.exports = mongoose.model("Grievances", grievanceSchema);