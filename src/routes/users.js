const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqid = require("uniqid");

const salt = bcrypt.genSaltSync(10);
const User = require("../models/user.model");
const mailer = require("../mailService");
const { CUSTOMER_QUERY_MAIL } = require("../../constants");

const formUserId = name => {
  let nameInitials = name.match(/\b\w/g) || [];
  nameInitials = (
    (nameInitials.shift() || "") + (nameInitials.pop() || "")
  ).toUpperCase();
  return `${nameInitials}-${uniqid.time()}`;
};

router.get("/", (req, res, next) => {
  User.find({}, { "password": 0 })
    .exec()
    .then(users => res.status(200).json(users));
});

router.get("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findOne({ userId }, { "password": 0 })
    .exec()
    .then(user => res.status(200).json(user));
});

router.post("/login", (req, res, next) => {
  const {
    email = "",
    password = ""
  } = req.body;
  User.findOne({ email }, { __v: 0 })
    .exec()
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        const userDoc = user._doc;
        delete userDoc.password;
        res.status(200).json({
          userDoc,
          success: true
        });
      } else {
        res.status(201).json({
          message: "Username or Password is invalid",
          success: false
        });
      }
    })
    .catch(() =>
      res.status(500).json({
        message: "Username or Password is invalid",
        success: false
      })
    );
});

router.post("/register", (req, res, next) => {
  const {
    name = "",
    email = "",
    password = "",
    mobile = ""
  } = req.body;

  User.countDocuments({
    $or: [{ email }, { mobile }]
  })
    .exec()
    .then(result => {
      if (result == 0) {
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          userId: formUserId(name),
          name,
          email,
          password: bcrypt.hashSync(password, salt),
          mobile
        });
        newUser
          .save()
          .then(() => {
            res.status(200).json({
              message: "User registered successfully",
              success: true
            });
          })
          .catch(() => {
            res.status(500).json({
              message: "Failed to register user",
              success: false
            });
          });
      } else {
        res.status(201).json({
          messgae: "User already exists",
          success: false
        });
      }
    });
});

router.post("/send/email", (req, res, next) => {
  const { transporter, mailOptions, constructMail } = mailer;
  mailOptions.html = constructMail(CUSTOMER_QUERY_MAIL, req.body);
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.status(401).json({
        err,
        message: "Unable to send mail",
        success: false
      })
    } else {
      res.status(200).json({
        success: true
      })
    }
  })
})

module.exports = router;
