// Importing express
const express = require("express");
const connectDB = require("./config/database");
// Instance of express application
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

// Signup API ==>> POST /signup ==>> for signup new user
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    // Validation of data
    validateSignUpData(req);

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

// Login API ==>> POST /login ==>> for log in user
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const dbUser = await User.findOne({ emailId: emailId });
    if (!dbUser) {
      throw new Error("Invalid credentials");
    }

    const hashPassword = dbUser.password;
    const isPasswordValid = await bcrypt.compare(password, hashPassword);

    if (isPasswordValid) {
      // Create JWT token
      const token = await jwt.sign({ _id: dbUser._id }, "DEV@Tinder$790");
      // Add the token to cookie and send the response back to the user

      res.cookie("token", token);
      res.send("User logged in successfully!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      throw new Error("Token not found in cookies");
    }
    // validate token
  
    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User data not found")
    }
  
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

// Find User By Email ==>> GET /user ==>> find one user from email
app.get("/user", async (req, res) => {
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
app.get("/feed", async (req, res) => {
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
app.delete("/user", async (req, res) => {
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
app.patch("/user", async (req, res) => {
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
