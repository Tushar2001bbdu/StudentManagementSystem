const express = require("express");
const Teachers = require("../models/Admins/Teachers");
const Router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Load environment variables from .env file
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
var AUTHAdmins = require("../middlewares/fetchDataForAdmins");



//Route to create account for a teacher in the Student Management System
Router.post(
  "/createTeacherRecord",
  
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("age", "Enter a valid age").notEmpty(),
    body("password", "Enter a valid password").isLength({ min: 3 }),
    body("course", "Enter a valid course").notEmpty(),
    body("gender", "Enter a valid gender").notEmpty(),
  ],
  async (req, res) => {
    
    const errors = validationResult(req);

    
    if (!errors.isEmpty()) {
      res.status(500).send({ success: "You have entered invalid credentials" });
      
    } else {
     
      try {
        let teacher = Teachers.findOne({ email: req.body.name });
       
        if (teacher == true) {
          res.status(401).send({success: "You have already an account on this Student Management System"});
        } else {
          const salt = await bcrypt.genSalt(10);
          const secPass = await bcrypt.hash(req.body.password, salt);
          
          
        teacher = await Teachers.create({
            
            name: req.body.name,
            password: secPass,
            course: req.body.course,
            age: req.body.age,
            gender: req.body.gender,
          });
          const data = {
            user: {
              id:teacher._id,
             
            },
            name:teacher.name,
          };
          const authToken = jwt.sign(data, JWT_SECRET);
        
          res.status(201).json({
            success: "You have successfully created an account",
            authenticationtoken: authToken,
          });
        }
      } catch (error) {
        
        res.status(500).send("Some error has occured");
      }
    }
  }
);
//Route to see Details of a Teacher in the Student Management System
Router.get(
  "/seeDetails",AUTHAdmins,
 

  async(req, res) => {
    
        try {
          var USER = jwt.verify(token,JWT_SECRET);
          
          let iuser = USER;
          console.log(USER)
          try {
            console.log(token)
            console.log(iuser.user.id)
      
            let admin = await Teachers.findById(USER.user.id);
            
            var JSON = {
              name: admin.name,
              course:admin.course,
              age: admin.age,
              gender:admin.gender,
            };
           
            res.json(JSON);
          } catch (error) {
            res.status(500).send({"status":"some error has occured"});;
          }
        } catch (error) {
          res.status(500).send({"status":"some error has occured"});;

        }
     
    
  }
);
//Route for logging in for a teacher in the Student Management System
Router.post(
  "/login",AUTHAdmins,
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "cannot be blank").exists(),
  ],
  
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result) {
        res.json({ success: "false" });
      } else {
        const { name, password } = req.body;
       
        let user = await Teachers.findOne({ name });
        if (!user) {
          res.status(401).send({"status": "Invalid Credentials" });
        } else {
          const PassCompare = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (!PassCompare) {
            res.status(401).send({"status": "Invalid Credentials" });
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
                       var JSON = { success: "true", authtoken: authtoken };

            res.status(201).send(JSON);
          }
        }
      }
    } catch (error) {
   
      res.status(500).send("Some error has occurred");
    }
  }
);
//Route to updating details for a teacher in the Student Management System
Router.put(
  "/updateDetails",AUTHAdmins,
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("age", "Enter a valid age").notEmpty(),
 
    body("course", "Enter a valid course").notEmpty(),
    body("gender", "Enter a valid gender").notEmpty(),
  ],
  
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result) {
        res.status(500).send({"status": "You have entered invalid data" });
      } else {
      
           
            let admin = await Teachers.findByIdAndUpdate(req.user.id,{name: req.body.name,
              
              course: req.body.course,
              age: req.body.age,
              gender: req.body.gender,});
            admin=await Teachers.findById(req.user.id)
           

            res.status(201).send(admin);
          }
        }
      
     catch (error) {
     
      res.status(500).send("Some error has occurred");
    }
  }
);

module.exports = Router;
