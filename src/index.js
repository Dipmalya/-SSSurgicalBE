const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const dbConfig = require("./db.config");

mongoose.connect(dbConfig, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("Connected to DB..");
});
mongoose.connection.on("error", () => {
  console.log("Failed to connect to DB..");
});

const port = process.env.port || 8080;
const server = http.createServer(app);

server.listen(port, () => {
  console.log("App running on port " + port);
});
