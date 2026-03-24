const express = require("express");
const path = require("path");
const {check, validationResult} = require('express-validator');
const app = express();

app.use(express.urlencoded({extended: false}));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));


app.set("view engine", "ejs");

// Load the home page
app.get("/", (req,res) => {
    res.render("home");
});

// Load the about page
app.get("/about", (req,res) => {
    res.render("about");
});

// Load the request page
app.get("/request", (req,res) => {
    res.render("request");
});

// Validate the form input
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
        let fullName = req.body.fullName;
        let studentID = req.body.studentID;
        let emailAddress = req.body.emailAddress;
        let programName = req.body.programName;
        let serviceType = req.body.serviceType;
        let urgencyLevel = req.body.urgencyLevel;
        let requestDescription = req.body.requestDescription;
        let preferredContactMethod = req.body.preferredContactMethod;
        let preferredContactMethod_index = -1;

        for(let i = 0; i< preferredContactMethod.length; i++) {
            if(preferredContactMethod[i].checked) {
                preferredContactMethod_index = i; // storing the index that the user selected
                break;
            }
        }

        // Checking if any of the radio buttons was selected
        if(preferredContactMethod_index > -1) {
            preferredContactMethod = preferredContactMethod[preferredContactMethod_index].value;
        }

        // Check the service type and assign it a fee
        let fee = 0;

        if(serviceType === "ID Card Replacement") {
            fee = 25;
        }
        else if(serviceType === "Enrollment Letter") {
            fee = 10;
        }
        else {
            fee = 0;
        }

        // Check the service type and urgency level and assign response time based on them
        let responseTime = "";

        if(serviceType === "ID Card Replacement") {
            if(urgencyLevel === "Not Urgent") {
                responseTime = "3-5 business days";
            }
            else {
                responseTime = "1-2 business days";
            }
        }
        else if(serviceType === "Enrollment Letter") {
            if(urgencyLevel === "Not Urgent") {
                responseTime = "2-3 business days";
            }
            else {
                responseTime = "1 business day";
            }
        }
        else {
            if(urgencyLevel === "Not Urgent") {
                responseTime = "1 business day";
            }
            else {
                responseTime = "Same day";
            }
        }

        // Put all the results into an object
        let results = {
            "fullName": fullName,
            "studentID": studentID,
            "emailAddress": emailAddress,
            "programName": programName,
            "serviceType": serviceType,
            "urgencyLevel": urgencyLevel,
            "requestDescription": requestDescription,
            "preferredContactMethod": preferredContactMethod,
            "fee": fee,
            "responseTime": responseTime
        }

        // Send the object to the front end
        res.render("results", {results: results});

    }
    // If errors found, display the errors to the page
    else {
        res.render("request", {errors: errors.array()});
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

