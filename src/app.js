// Importing express
const express = require("express");
const connectDB = require("./config/database");
// Instance of express application
const app = express();
const User = require("./models/user");

app.use(express.json());

// Signup API ==>> POST /signup ==>> for signup new user
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    console.log("Error", error);
    res.status(400).send("Error saving the user: "+ error.message);
  }
});

// Find User By Email ==>> GET /user ==>> find one user from email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found : "+ error.message);
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong :" + error.message);
  }
});

// User Feed API ==>> GET /feed ==>> get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found : "+ error.message);
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong : "+ error.message);
  }
});

// User Delete API ==>> DELETE /user ==>> delete user from database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found : "+ error.message);
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong : " + error.message);
  }
});

// User Update API ==>> PATCH /user ==>> update user from database
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    if (!user) {
      return res.status(404).send("User not found : "+ error.message);
    }
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong : "+ error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    // Listening to the port 8080
    app.listen(8080, () => {
      console.log("Server is successfully running on port 8080");
    });
  })
  .catch(() => {
    console.log("Error from database: ", error);
  });
