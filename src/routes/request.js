const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

// Send Connection Request API ==>> POST /sendConnectionRequest ==>> Send connection request
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

module.exports = requestRouter;
