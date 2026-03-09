// Importing express
const express = require("express");
const connectDB = require("./config/database");
// Instance of express application
const app = express();

connectDB()
  .then(() => {
    console.log("Database connected successfully")
    // Listening to the port 8080
    app.listen(8080, () => {
      console.log("Server is successfully running on port 8080");
    });
  })
  .catch(() => {
    console.log("Error from database: ", error);
  });

// Hello Request Handler
// app.use("/api/hello", (req, res) => {
//   res.send("Hello From Server");
// });

// Test Request Handler
// app.use("/api/test", (req, res) => {
//   res.send("Test From Server");
// });

// app.get("/api/users", (req, res) => {
//   res.send([
//     {
//       id: 1,
//       name: "John Doe",
//       email: "john.doe@example.com",
//     },
//   ]);
// });

// app.post("/api/users", (req, res) => {
//   res.send("User created successfully");
// });

// app.put("/api/users/:id", (req, res) => {
//   res.send("User updated successfully");
// });

// app.delete("/api/users/:id", (req, res) => {
//   res.send("User deleted successfully");
// });

// app.use("/", (req, res) => {
//   res.send("Namaste From Server");
// });
