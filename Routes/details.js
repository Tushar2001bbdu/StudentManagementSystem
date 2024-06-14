var AUTH = require("../middlewares/fetchdata");
const express = require("express");
const User = require("../models/Admins/Teachers");
const Results = require("../models/results");
const Details = require("../models/Details");
const Router = express.Router();
const { body, validationResult } = require("express-validator");
// Load environment variables from .env file
require('dotenv').config();
const jwt = require("jsonwebtoken");
const details = require("../models/Details");
const JWT_SECRET = process.env.JWT_SECRET;
//LA-Library Availed;AF-Academic Fees;TF-Total Fees Paid;FP-Training and Placement Fees Paid
//Route adding necessary details for a student having a account in the Student Management System
Router.post(
  "/addDetails",
  AUTH,
  [
    body("LA", "Enter a valid value").notEmpty(),
    body("AF", "Enter academic fees of student").notEmpty(),
    body("TF", "Enter a Total Fees").notEmpty(),
    body("FP", "Enter a valid course").notEmpty(),
  ],
 
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(500).send({ success: "You have entered invalid data" });

        return;
      }
       console.log(req.user)
      let user = await User.findOne({user: req.user._id });

      let result = await Details.create({
        user: req.user._id,
        LibraryAvailed: req.body.LA,
        AcademicFeesPaid: req.body.AF,
        TotalFeesPaid: req.body.TF,
        TandPFeesPaid: req.body.FP,
      });

      res.status(201).json(result);
    } catch (error) {
      console.log(error)
      res.status(500).send({ status: "some error has occured" });
    }
  }
);
//Route for updating Academic Fees Paid for a student having a account in the Student Management System
Router.put("/changeAcadFees", AUTH, async (req, res) => {
  try {
    let user = await Details.findOneAndUpdate(
      { user: req.user._id },
      { AcademicFeesPaid: req.body.AF }
    );
    user = await Details.findOne({ user: req.user._id });
    res.status(200).json(user);
  } catch (error) {
    console.log(error)
    res.status(501).send({ status: "some error has occured" });
  }
});
//Route for displaying necessary details for a student having a account in the Student Management System
Router.get("/displayDetails", AUTH, async (req, res) => {
  try {
    let user = await Details.findOne({ user: req.user._id });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ status: "some error has occured" });
  }
});
//Route for updating Total Fees Paid  for a student having a account in the Student Management System
Router.put("/changeTotalFees", AUTH, async (req, res) => {
  try {
   

    let user = await Details.findOneAndUpdate(
      { user: req.user._id },
      { TotalFeesPaid: req.body.TF }
    );

    user = await Details.findOne({ user: req.user._id });

    res.status(200).json(user);
  } catch (error) {
    res.status(501).send({ status: "some error has occured" });
  }
});
//Route for updating Training and Placement Fees Paid  for a student having a account in the Student Management System
Router.put("/changeTandPFees", AUTH, async (req, res) => {
  try {
    let user = await Details.findOneAndUpdate(
      { user: req.user._id },
      { TandPFeesPaid: req.body.FP }
    );
    user = await Details.findOne({ user: req.user._id });

    res.status(201).json(user);
  } catch (error) {
    res.status(501).send({ status: "some error has occured" });
  }
});
//Route for updating whether Student has availed Library Or Not  for a student having a account in the Student Management System
Router.put("/changeLibraryAvailed", AUTH, async (req, res) => {
  try {
    let user = await Details.findOneAndUpdate(
      { user: req.user._id },
      { LibraryAvailed: req.body.LA }
    );
    user = await Details.findOne({ user: req.user._id });

    res.status(200).json(user);
  } catch (error) {
    res.status(501).send({ status: "some error has occured" });
  }
});

module.exports = Router;
