const express = require("express");
const User = require("../models/Users");
const Router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Load environment variables from .env file
require('dotenv').config();
const JWT_SECRET =process.env.JWT_SECRET;
var AUTH = require("../middlewares/fetchdata");
//Route to create account for a student in the Student Management System
Router.post(
  "/createuser",
  
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Enter a valid password").isLength({ min: 5 }),
    body("section", "Enter a valid section").isLength({ min: 3 }),
    body("course", "Enter a valid course").isLength({ min: 5 }),
    body("branch", "Enter a valid branch").isLength({ min: 5 }),
  ],
  async (req, res) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(500).send({ "success": "You have entered inavlid credentials" });
      
    } else {
    
      try {
        let user = User.findOne({ email: req.body.name });
        
        if (user == true) {
          res.status(500).send({ success: "false" });
        } else {
          const salt = await bcrypt.genSalt(10);
          const secPass = await bcrypt.hash(req.body.password, salt);
          
         
          user = await User.create({
            
            name: req.body.name,
            password: secPass,
            section: req.body.section,
            course: req.body.course,
            branch: req.body.branch,
            classTeacher:req.body.classTeacher
          });
          const data = {
            user: {
              id:user._id,
             
            },
            name:user.name,
          };
          const authToken = jwt.sign(data, JWT_SECRET);
          
          res.status(201).json({
            success: "You have successfully created an account",
            authenticationtoken: authToken,
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("Some error has occured");
      }
    }
  }
);
//Route to set Class Teacher for a student in the Student Management System
Router.put(
  "/setTeacher",
 

  async(req, res) => {
    
       
          try {
           
      
            let user = await User.findByIdAndUpdate({classTeacher:req.body.TeacherNmae},req.user.user._id);
            
            var JSON = await User.findById(req.user.user._id);
           
          
            res.status(201).json(JSON);
          } catch (error) {
            res.status(500).send({"status":"some error has occured"});
          }
        

        }
      
);
//Route to see Details for a student in the Student Management System
Router.get(
  "/seeDetails",
 AUTH,

  async(req, res) => {
   
       
         
          try {
            
      
            let user = await User.findById(req.user._id);

        
            var JSON = {
              name: user.name,
              section: user.course,
              branch: user.branch,
              section: user.section,
            };
           
            res.status(200).json(JSON);
          } catch (error) {
            res.status(500).send({"status":"some error has occured"});
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
        const { name, password } = req.body;
        console.log(req.body.password);
        let user = await User.findOne({ name });
        if (!user) {
          res.status(200).json({ success: "false" });
        } else {
          const PassCompare = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (!PassCompare) {
            res.status(200).json({ success: "false" });
          } else {
            var data = {
              user: {
                _id: user._id,
              },
              name:user.name

              
            };
            const dat = data.user._id;
            var authtoken = jwt.sign(data, JWT_SECRET);
            auth = data.user._id;
            console.log(auth);
            var JSON = { success: "true", authtoken: authtoken };

            res.status(200).json(JSON);
          }
        }
      }
    } catch (error) {
      
      res.status(500).send("Some error has occurred");
    }
  }
);

module.exports = Router;
