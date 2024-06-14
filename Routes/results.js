var AUTH = require("../middlewares/fetchdata");
const express = require("express");
const User = require("../models/Admins/Teachers");
const Results = require("../models/results");
const Router = express.Router();




const jwt = require("jsonwebtoken");
// Load environment variables from .env file
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
//Route for adding result for a student having a account in the Student Management System
Router.post("/addResult", AUTH, async (req, res) => {
  
      try {
        var USER = jwt.verify(token, JWT_SECRET);
       

        let user = await User.findOne({ name: USER.name });
        let marks = req.body.marks;
        let grade = "";
        if (marks >= 0 && marks <= 60) {
          grade = "D";
        } else if (marks > 60 && marks <= 80) {
          grade = "C";
        } else if (marks > 80 && marks <= 90) {
          grade = "B";
        } else {
          grade = "A";
        }
       
        let result = await Results.create({
          user: req.user._id,

          name: user.name,
          marks: req.body.marks,
          grade: grade,
        });

        res.status(201).json(result);
      } catch (error) {
        res.status(500).send({"status":"some error has occured"});
      }
   
});
//Route to updating result for a student having a account in the Student Management System
Router.put("/changeResult", AUTH, async (req, res) => {
  
      try {
        var USER = jwt.verify(token, JWT_SECRET);

        let ID = USER.name;
        console.log(req.user.name);
        let marks = req.body.marks;
        let grade = "";
        if (marks >= 0 && marks <= 60) {
          grade = "D";
        } else if (marks > 60 && marks <= 80) {
          grade = "C";
        } else if (marks > 80 && marks <= 90) {
          grade = "B";
        } else {
          grade = "A";
        }
       
        let user = await Results.findOneAndUpdate(
          { user: req.user._id },
          { marks: marks, grade: grade }
        );
        user=await Results.findOne(
          { user: req.user._id }
          
        );
        res.status(201).send(user)
       
      } catch (error) {
        res.status(500).send({"status":"some error has occured"});
      }
   
});
//Route updating attendance for a student having a account in the Student Management System
Router.put("/setAttendance", AUTH, async (req, res) => {
  
      try {
        var USER = jwt.verify(token, JWT_SECRET);

        let attendance = req.body.attendance;
        let rate = (attendance / req.body.days) * 100;
        let user = await Results.findOneAndUpdate(
          { user: req.user._id },
          { attendance: rate }
        );
        user=await Results.findOne(
          { user: req.user._id }
          
        );
        res.status(201).send(user)
      } catch (error) {
        res.send({"status":"some error has occured"});
      }
    }
 );
 //Route for displaying attendance and result for a student having a account in the Student Management System
Router.get("/displayResult", AUTH, async (req, res) => {
  
      try {
       
        let user = await Results.findOne({user:req.user.id})
        res.status(201).send(user);
      } catch (error) {
        res.status(500).send({"status":"some error has occured"});
      }
    }
  
);

module.exports = Router;
