const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 2000

mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (error) => {
    if (!error) {
        console.log("MongoDb Connection: ", process.env.MONGO_URL);
    } else {
        console.log("database not working", error)
    }
});
mongoose.set('useCreateIndex', true)
mongoose.set('debug', true);
app.use(morgan("tiny"))
app.use(bodyParser.json());
app.use("/images", express.static(process.env.IMAGE_URL + "uploads/"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
require("./routes")(app, express) // routes imported
app.listen(port, '0.0.0.0')
console.log("server running on port: http://localhost:" + port)