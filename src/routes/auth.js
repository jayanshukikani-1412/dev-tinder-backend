const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

// Signup API ==>> POST /signup ==>> for signup new user
authRouter.post("/signup", async (req, res) => {
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
    const savedUser = await user.save();

    // Create JWT token
    const token = await savedUser.getJWT();
    // Add the token to cookie and send the response back to the user
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 3600000),
      secure: true,
    });
    res.json({
      message: "User added successfully",
      data: savedUser,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

// Login API ==>> POST /login ==>> for log in user
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create JWT token
      const token = await user.getJWT();
      // Add the token to cookie and send the response back to the user

      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 3600000),
        secure: true,
      });
      res.json({
        message: "Logged in successfully!!",
        data: user,
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

// Logout API ==>> POST /logout ==>> for logout user
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User Logged Out Successfully !!!");
});

module.exports = authRouter;
