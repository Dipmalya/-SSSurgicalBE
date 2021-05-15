const { query } = require("express");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "--email--@gmail.com",
    pass: "--password--",
  },
});

const mailOptions = {
  from: "email@gmail.com",
  to: "email@gmail.com",
  subject: "Customer Query"
};

const constructMail = (name, mobile, query) => (
  `Query From -
    ${name}
    Contact - ${mobile}
    Query - ${query}
  `
)

module.exports = {
  transporter,
  mailOptions,
  constructMail
};
