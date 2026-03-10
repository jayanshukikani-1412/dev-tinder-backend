const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();
const USER_SAFE_DATA_KEY = "firstName lastName photoUrl emailId";

// get all the pending connection request for the loggedInUser
userRouter.get("/user/request", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      data: connectionRequests,
      message: "Data fetch successfully",
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA_KEY) 
      .populate("toUserId", USER_SAFE_DATA_KEY);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      data: data,
      message: "Data fetch successfully",
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = userRouter;
