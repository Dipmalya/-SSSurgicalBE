const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoute = require("./routes/users");
const productRoute = require("./routes/products");
const adminRoute = require("./routes/admin");
const orderRoute = require("./routes/orders");

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "*");
    return res.status(200).json({});
  }
  next();
});

app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/admin", adminRoute);
app.use("/order", orderRoute);

app.get('/*', function(req, res, next){ 
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next(); 
});

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message
  });
});

module.exports = app;
