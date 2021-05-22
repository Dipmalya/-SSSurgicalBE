const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gymapp2021@gmail.com",
    pass: process.env.MAILPWD,
  },
});

const mailOptions = {
  from: "gymapp2021@gmail.com",
  to: "gymapp2021@gmail.com",
  subject: "Customer Query",
  attachments: [
    {
      filename: "Logo.png",
      path: __dirname + "/media/logo-mail.png",
      cid: "logo"
    },
  ],
};

const constructMail = (format, object) => {
  const source = fs.readFileSync(path.join(__dirname, `${format}.hbs`), "utf8");
  const template = handlebars.compile(source);
  return template(object);
};

module.exports = {
  transporter,
  mailOptions,
  constructMail,
};
