const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");

const profileRouter = express.Router();

// Profile API ==>> GET /profile ==>> get user profile details
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

// Profile API ==>> GET /profile ==>> get user profile details
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const data = req.body;
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();
    res.json({
      message: "Your profile updated successfully",
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Something went wrong : " + error.message);
  }
});

module.exports = profileRouter;
