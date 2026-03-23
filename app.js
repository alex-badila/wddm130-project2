const express = require("express");
const path = require("path");
const {check, validationResult} = require('express-validator');
const app = express();

app.use(express.urlencoded({extended: false}));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));


app.set("view engine", "ejs");

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/request", (req,res) => {
    res.render("request");
});

app.post("/request", [
    check("fullName", "Full name is empty").notEmpty(),
    check("studentID", "Invalid student ID").matches(/^\d{3}-\d{3}-\d{4}$/),
    check("emailAddress", "Not a valid email").isEmail(),
    check("programName", "No program name").notEmpty(),
    check("serviceType", "Service type not selected").notEmpty(),
    check("urgencyLevel", "Urgency level not selected").notEmpty(),
    check("requestDescription", "Request description empty").notEmpty(),
    check("preferredContactMethod", "Preferred contact method not selected").notEmpty(),
], (req, res) => {

    const errors = validationResult(req);

    // If no errors found, display the results to the page
    if(errors.isEmpty()) {
        
    }
    // If errors found, display the errors to the page
    else {
        res.render("request", {errors: errors.array()});
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

