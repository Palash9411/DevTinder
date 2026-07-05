const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();

const User = require('../models/user');
const ConnectionRequestModel = require('../models/connectionRequest');

requestRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user.objectId;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatuses = ['ignored', 'interested'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).send('Invalid status' + status);
        }
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).send('Connection request already exists');
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();

        res.json({
            message:
                req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });

    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
});


requestRouter.post('request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatuses = ['accepted', 'rejected'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).send('Invalid status' + status);
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found!" });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message: "Connection request " + status,
            data,
        });

    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
});

module.exports = requestRouter;