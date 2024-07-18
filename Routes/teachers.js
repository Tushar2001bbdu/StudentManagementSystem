const express = require("express");
const Teachers = require("../models/Admins/Teachers");
const Router = express.Router();
const { body, validationResult } = require("express-validator");
const Results = require("../models/results");
// Load environment variables from .env file
require("dotenv").config();

const User = require("../models/Users");
const admin = require("firebase-admin");

const app2 = admin.app("app2");
const apiKey =  process.env.APK2;
var loggedIn = false;

//Route to see Details of a Teacher in the Student Management System
Router.get(
  "/seeDetails",

  async (req, res) => {
    if (loggedIn === true) {
      try {
        try {
          console.log(req.user);
          let admin = await Teachers.findById(req.user._id);

          var JSON = {
            name: admin.name,
            course: admin.course,
            age: admin.age,
            gender: admin.gender,
          };

          res.json(JSON);
        } catch (error) {
          console.log(error);
          res.status(500).send({ status: "some error has occured" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({ status: "some error has occured" });
      }
    } else {
      res.status(401).send("You have not logged in currently");
    }
  }
);
//Route for logging in for a teacher in the Student Management System
Router.post(
  "/login",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "cannot be blank").exists(),
  ],

  async (req, res) => {
    try {
      let result = validationResult(req);
      if (!result) {
        res.json({ success: "false" });
      } else {
        const DATA = JSON.stringify({
          email: req.body.email,
          password: req.body.password,
          returnSecureToken: true,
        });

        // Use Firebase Authentication REST API to sign in
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: DATA,
          }
        );
        if (response.statusText !== "OK") {
          res.status(401).send("You have entered invalid credentials");
        } else {
          loggedIn = true;
          res.status(201).send("You have logged in successfully");
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error has occurred");
    }
  }
);
//Route to get List Of Students
Router.get("/listOfStudents", async (req, res) => {
  try{
    if (loggedIn === true) {
      const ListOfStudents = await User.find({ classTeacher: req.body.name });
      res.status(201).send(ListOfStudents);
    } else {
      res.status(401).send("You have not logged in successfully");
    }
  }
  catch(error){
res.status(500).send("Some error has occured")
  }
 
});
//Route to set attendance of a particular student by teacher
Router.put("/setAttendance", async (req, res) => {
  if (loggedIn === true) {
    var user = await Results.findOne({ rollno: req.body.rollno });
    var attendance = user.attendance + 1;
    user = await Results.findOneAndUpdate(
      { rollno: req.body.rollno },
      { attendance: attendance }
    );
    user = await Results.findOne({ rollno: req.body.rollno });
    res.status(201).send(user);
  } else {
    res.status(401).send("You have not logged in successfully");
  }
});

//Route to allow  teacher to update marks of his/her students using his university roll no
Router.put("/updateData", async (req, res) => {
  try {
    if (loggedIn === true) {
      let grade = "F";

      if (req.body.marks > 0 && req.body.marks < 40) {
        grade = "F";
      } else if (req.body.marks > 40 && req.body.marks <= 60) {
        grade = "E";
      } else if (req.body.marks > 60 && req.body.marks <= 65) {
        grade = "D";
      } else if (req.body.marks > 65 && req.body.marks <= 80) {
        grade = "C";
      } else if (req.body.marks > 80 && req.body.marks <= 90) {
        grade = "B";
      } else if (req.body.marks > 80 && req.body.marks <= 90) {
        grade = "B";
      } else if (req.body.marks > 90 && req.body.marks < 90) {
        grade = "A";
      } else {
        grade = "O";
      }
let response=Results.findOne({rollno:req.body.rollno})
if(response===null){
  res.status(401).send("There is no such student account")
}
else{

       response = await Results.findOneAndUpdate(
        { rollno: req.body.rollno },
        { $set: { marks: req.body.marks, grade: grade } }
      );

      response = await Results.findOne({ rollno: req.body.rollno });
      res.status(200).json(response);}
    } else {
      res.status(401).send("You have not logged in successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Some error has occured");
  }
});
Router.put(
  "/passwordResetEmail",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "cannot be blank").exists(),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result) {
        res.status(500).json({ success: "false" });
      } else {
        try {
          const link = await app2
            .auth()
            .generatePasswordResetLink(req.body.email);
          console.log(link);
          res.status(200).send("A password reset email has been sent");
        } catch (error) {
          console.log(error);
          res.status(200).send("There has been some error during the process");
          // Error occurred. Inspect error.code.
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error has occurred");
    }
  }
);

module.exports = Router;
