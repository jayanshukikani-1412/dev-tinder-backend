// Importing express
const express = require("express");

// Instance of express application
const app = express();

// Hello Request Handler
app.use("/api/hello",(req, res) => {
  console.log("Request received");
  res.send("Hello From Server");
});

// Test Request Handler
app.use("/api/test",(req, res) => {
  console.log("Request received");
  res.send("Test From Server");
});


// Listening to the port 8080
app.listen(8080, () => {
  console.log("Server is successfully running on port 8080");
});
