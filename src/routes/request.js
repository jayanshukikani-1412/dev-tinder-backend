const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

// Send Connection Request API ==>> POST /sendConnectionRequest ==>> Send connection request
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent connection request !!");
});

module.exports = requestRouter;
