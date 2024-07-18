const express = require("express");

const User = require("../models/Users");
const Results = require("../models/results");
const Details = require("../models/Details");
const Router = express.Router();

const { body, validationResult } = require("express-validator");
// Load environment variables from .env file
require("dotenv").config();

const Teachers = require("../models/Admins/Teachers");

const bcrypt = require("bcrypt");
// Import the functions you need from the SDKs you need
const admin = require("firebase-admin");


const users = require("../models/Users");
const teachers = require("../models/Admins/Teachers");
const app1 = admin.app("app1");
const app2 = admin.app("app2");

//LA-Library Availed;AF-Academic Fees;TF-Total Fees Paid;FP-Training and Placement Fees Paid
//Route adding necessary details for a student having a account in the Student Management System

//Route for updating Academic Fees Paid for a student having a account in the Student Management System
Router.post(
  "/createuser",

  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Enter a valid password").isLength({ min: 5 }),
    body("section", "Enter a valid section").isLength({ min: 3 }),
    body("course", "Enter a valid course").isLength({ min: 5 }),
    body("branch", "Enter a valid branch").isLength({ min: 5 }),
    body("teacher", "Enter a valid Teacher Name").isLength({ min: 5 }),
    body("rollno", "Enter a valid Roll No").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.status(500).send({ success: "You have entered inavlid credentials" });
    } else {
      try {
        let user = User.findOne({ rollno: req.body.rollno });

        if (user == true) {
          res
            .status(500)
            .send({ success: "There is already an account of the user" });
        } else {
          const salt = await bcrypt.genSalt(10);
          const secPass = await bcrypt.hash(req.body.password, salt);

          let USERS = await User.create({
            email: req.body.email,
            name: req.body.name,
            password: secPass,
            section: req.body.section,
            course: req.body.course,
            branch: req.body.branch,
            classTeacher: req.body.teacher,
            rollno: req.body.rollno,
          });
          let USER = {
            email: req.body.email,
            password: req.body.password,
          };
          const userResponse = await admin.auth(app1).createUser({
            email: USER.email,
            password: USER.password,
            emailVerified: false,
            disabled: false,
          });
          console.log(userResponse);

          res.status(201).json({
            success: "You have successfully created an account",
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("Some error has occured");
      }
    }
  }
);
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
      res
        .status(500)
        .send({ success: "You have entered invalid data to create a account" });
    } else {
      try {
        let teacher = Teachers.findOne({ rollno: req.body.rollno });

        if (teacher == true) {
          res
            .status(401)
            .send({
              success:
                "You have already an account on this Student Management System",
            });
        } else {
          teacher = await Teachers.create({
            email: req.body.email,
            rollno: req.body.rollno,
            name: req.body.name,
            password: req.body.password,
            course: req.body.course,
            age: req.body.age,
            gender: req.body.gender,
          });
          let USER = {
            email: req.body.email,
            password: req.body.password,
          };
          const userResponse = await admin.auth(app2).createUser({
            email: USER.email,
            password: USER.password,
            emailVerified: false,
            disabled: false,
          });

          res.status(201).json({
            success: "You have successfully created an account",
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("Some error has occured");
      }
    }
  }
);

Router.post("/addResult", async (req, res) => {
  try {
    let user = await Results.findOne({ rollno: req.body.rollno });
if(user!==null){
  res.status(401).send("You have already added Result")
}
else{
  let result = await Results.create({
    rollno: req.body.rollno,
    name: req.body.name,
  });

  res.status(201).json(result);
}
    
  } catch (error) {
    console.log(error);
    res.status(401).json("You have entered invalid data");
  }
});
Router.post("/addDetails", async (req, res) => {
  try {
    let user = await User.findOne({ rollno: req.body.rollno });
    if(user!==null){
      res.status(401).send("You have already added Result")
    }
    else{

    
    let details = await Details.create({
      name: user.name,
      rollno: user.rollno,
      marks: "0",
      grade: "F",
    });

    res.status(201).json(details);}
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "some error has occured" });
  }
});

Router.put("/changeAcadFees", async (req, res) => {
  try {
    let user = await Details.findOne(
      { rollno: req.body.rollno })
    if(user===null){
      res.status(401).send("You have not created the student Details account")
    }
    else{
    user = await Details.findOneAndUpdate(
      { rollno: req.body.rollno },
      { AcademicFeesPaid: req.body.AF }
    );
    let TFP = user.TotalFeesPaid;
    TFP = TFP + req.body.AF;
    user = await Details.findOneAndUpdate(
      { rollno: req.body.rollno },
      { TotalFeesPaid: TFP }
    );
    user = await Details.findOne({ rollno: req.body.rollno });

    res.status(200).json(user);}
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: "some error has occured" });
  }
});

//Route for updating Training and Placement Fees Paid  for a student having a account in the Student Management System
Router.put("/changeTandPFees", async (req, res) => {
  try {
    let user = await Details.findOne(
      { rollno: req.body.rollno })
    if(user===null){
      res.status(401).send("You have not created the student Details account")
    }
    else{

    user = await Details.findOneAndUpdate(
      { rollno: req.body.rollno },
      { TandPFeesPaid: req.body.TP }
    );
    let TFP = user.TotalFeesPaid;
    TFP = TFP + req.body.TP;
    user = await Details.findOneAndUpdate(
      { rollno: req.body.rollno },
      { TotalFeesPaid: TFP }
    );
    user = await Details.findOne({ rollno: req.body.rollno });

    res.status(201).json(user);}
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: "some error has occured" });
  }
});
//Route for updating whether Student has availed Library Or Not  for a student having a account in the Student Management System
Router.put("/changeLibraryAvailed", async (req, res) => {
  try {
    let user = await Details.findOne(
      { rollno: req.body.rollno })
    if(user===null){
      res.status(401).send("You have not created the student Details account")
    }
    else{
     user = await Details.findOneAndUpdate(
      { rollno: req.body.rollno },
      { LibraryAvailed: req.body.LA }
    );
    user = await Details.findOne({ rollno: req.body.rollno });

    res.status(200).json(user);}
  } catch (error) {
    res.status(501).send({ status: "some error has occured" });
  }
});
Router.put("/changeTeacherAttendance", async (req, res) => {
  try {
    let user = await Teachers.findOne(
      { rollno: req.body.rollno })
    if(user===null){
      res.status(401).send("You have not created the Teachers account")
    }
    else{
     user = await Teachers.findOne(
      { rollno: req.body.rollno }
      
    );
    let attendance=user.attendance+1;
    
     user=await Details.findOneAndUpdate({ rollno: req.body.rollno },{attenadnce:attendance});

    res.status(200).json(user);}
  } catch (error) {
    res.status(501).send({ status: "some error has occured" });
  }
});
Router.delete("/deleteStudent",async(req,res)=>{
  try {
    let user = await Details.findOne(
      { rollno: req.body.rollno })
    if(user===null){
      res.status(401).send("You have not created the student Details account")
    }
    else{
     await Details.findOneAndDelete(
      { rollno: req.body.rollno },
      
    );
    await Results.findOneAndDelete(
      { rollno: req.body.rollno },
      
    );
    await users.findOneAndDelete(
      { rollno: req.body.rollno },
      
    );
    

    res.status(200).send("The student account has been deleted successfully");}
  } catch (error) {
    res.status(501).send({ status: "some error has occured" });
  }
})
Router.delete("/deleteTeacher",async(req,res)=>{
  try {
    let user = await teachers.findOne(
      { rollno: req.body.rollno })
    if(user===null){
      res.status(401).send("You have not created the student Details account")
    }
    else{
     await teachers.findOneAndDelete(
      { rollno: req.body.rollno },
      
    );
    
    

    res.status(200).send("The student account has been deleted successfully");}
  } catch (error) {
    res.status(501).send({ status: "some error has occured" });
  }
})
module.exports = Router;
