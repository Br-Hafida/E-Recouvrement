const express = require('express');
const app = express();
//--------------------------------------------------
const nodemailer = require('nodemailer');
//---------------------------------------------------------------------------------
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
//---------------------------------------------------------------------------------
var routes = require('./route/routes');
//---------------------------------------------------------------------------------
const cors = require('cors');
//---------------------------------------------------------------------------------
const allowedOrigins = ["http://localhost:4200"];

app.use(cors({
  origin: allowedOrigins
}));


app.listen(9992, function check(err) {
    if (err) {
        console.log("error", err)
    } else {
        console.log("started")
    }
});

mongoose.connect("mongodb://127.0.0.1:27017/gks", { useNewUrlParser: true,  useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log("successfully Connected to DB");
});

mongoose.connection.on('error', (error) => {
    console.log("Error Connecting to DB", error);
});

app.use(express.json());
app.use(routes);
