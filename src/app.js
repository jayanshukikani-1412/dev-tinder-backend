// Importing express
const express = require("express");
const connectDB = require("./config/database");
// Instance of express application
const app = express();
const User = require("./models/user")

app.use(express.json());
 
app.post("/signup", async (req, res) => {
console.log("req", req.body)
  const user = new User(req.body)

  try {
    await user.save()
    res.send("User added successfully")
  } catch (error) {
    console.log("Error", error)
    res.status(400).send("Error saving the user: ", error.message)
  }
})

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