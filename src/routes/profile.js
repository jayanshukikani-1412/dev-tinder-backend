const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

// Profile API ==>> GET /profile/view ==>> get user profile details
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({ message: "Data fetched Successfully", data: user });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

// Profile Update API ==>> PATCH /profile/edit ==>> edit user profile details
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
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

// Profile Password Update API ==> PATCH /profile/password ==>> Update user password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = req.user;

    const isPasswordValid = await user.validatePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error("Old password is not correct");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.send("Password Updated Successfully");
  } catch (error) {
    res.status(400).send("Something went wrong : " + error.message);
  }
});

module.exports = profileRouter;
