// Importing express
const express = require("express");
const connectDB = require("./config/database");
// Instance of express application
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// Find User By Email ==>> GET /user ==>> find one user from email
app.get("/user", userAuth, async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found : " + error.message);
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong :" + error.message);
  }
});

// User Feed API ==>> GET /feed ==>> get all the users from the database
app.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found : " + error.message);
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong : " + error.message);
  }
});

// User Delete API ==>> DELETE /user ==>> delete user from database
app.delete("/user", userAuth, async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found : " + error.message);
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong : " + error.message);
  }
});

// User Update API ==>> PATCH /user ==>> update user from database
app.patch("/user", userAuth, async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!isUpdateAllowed) {
      throw new Error("Updates not allowed");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    if (!user) {
      return res.status(404).send("User not found : " + error.message);
    }
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong : " + error.message);
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
