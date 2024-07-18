const express = require("express");
const User = require("../models/Users");
const Router = express.Router();
const { body, validationResult } = require("express-validator");

// Load environment variables from .env file
require("dotenv").config();

const admin = require("firebase-admin");
const Results = require("../models/results");
const details = require("../models/Details");

const app1 = admin.app("app1");
const apiKey = process.env.APK1

let loggedIn = false;
//Route to see Details for a student in the Student Management System
Router.get(
  "/seeDetails",

  async (req, res) => {
    try {
      if (loggedIn === false) {
        res.status(401).send("You have not logged in ");
      } else if (loggedIn === true) {
        let user = await User.findOne({ rollno: req.body.rollno });

        var JSON = {
          name: user.name,
          course: user.course,
          branch: user.branch,
          section: user.section,
          teacher: user.classTeacher,
        };

        res.status(200).json(JSON);
      }
    } catch (error) {
      res.status(500).send({ status: "some error has occured" });
    }
  }
);
//Route for logging in for a student in the Student Management System
Router.post(
  "/login",
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
        const { email, password } = req.body;
        const DATA = JSON.stringify({
          email: email,
          password: password,
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
        console.log(response);
        if (response.statusText === "OK") {
          loggedIn = true;

          res.send("you have logged in successfully");
        } else {
          res.send("you have entered invalid credentials");
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error has occurred");
    }
  }
);

Router.put(
  "/passwordResetEmail",
  [body("email", "Enter a valid e-mail").isLength({ min: 3 })],
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result) {
        res.status(500).json({ success: "false" });
      } else {
        try {
          const link = await app1
            .auth()
            .generatePasswordResetLink(req.body.email);

          res.status(200).send("The password reset link is" + link);
        } catch (error) {
          res.status(500).send("There has been some error during the process");
          // Error occurred. Inspect error.code.
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error has occurred");
    }
  }
);
Router.get(
  "/getResult",
  [body("rollno", "Enter a valid roll-no").isLength({ min: 3 })],
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result) {
        res.status(500).json({ success: "false" });
      } else {
        if (loggedIn === true) {
          let user = await Results.findOne({ rollno: req.body.rollno });

          res.status(200).json(user);
        } else {
          res.status(401).send("You have not logged in successfully");
          // Error occurred. Inspect error.code.
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("There has been some error during the process");
    }
  }
);

Router.get(
  "/getDetails",
  [body("rollno", "Enter a valid roll-no").isLength({ min: 3 })],
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result) {
        res.status(500).json({ success: "false" });
      } else {
        if (loggedIn === true) {
          let user = await details.findOne({ rollno: req.body.rollno });

          res.status(200).json(user);
        } else {
          res.status(401).send("You have not logged in successfully");
          // Error occurred. Inspect error.code.
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("There has been some error during the process");
    }
  }
);

module.exports = Router;
