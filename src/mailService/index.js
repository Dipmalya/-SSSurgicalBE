const fs = require('fs');
const path = require('path');
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gymapp2021@gmail.com",
    pass: process.env.MAILPWD,
  },
});

const source = fs.readFileSync(path.join(__dirname, 'mail-format.hbs'), 'utf8');
const template = handlebars.compile(source);

const mailOptions = {
  from: "gymapp2021@gmail.com",
  to: "gymapp2021@gmail.com",
  subject: "Customer Query"
};

const constructMail = object => template(object)

module.exports = {
  transporter,
  mailOptions,
  constructMail
};
