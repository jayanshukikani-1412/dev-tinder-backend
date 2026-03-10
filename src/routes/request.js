const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

// Send Connection Request API ==>> POST /request/send ==>> Send connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (fromUserId.equals(toUserId)) {
        res.status(400).json({
          message: "Same user connection request not sent",
        });
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({
          message: "Invalid status type : " + status,
        });
      }

      // If there is an existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        res.status(400).json({
          message: "Connection Request Already Exists",
        });
      }

      const userExist = await User.findById(toUserId);

      if (!userExist) {
        res.status(400).json({
          message: "User not found",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection Request Sent Successfully",
        data: data,
      });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  },
);

// Review Connection Request API ==>> POST /request/review ==> review connection request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const userId = req.user._id;
      const requestId = req.params.requestId;
      const status = req.params.status;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({
          message: "Invalid status type : " + status,
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        res.status(404).json({
          message: "Connection Request Not found",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection Request " + status, data });
    } catch (error) {
      res.status(400).send("Error " + error.message);
    }
  },
);

module.exports = requestRouter;
