const express = require ('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//get all the connection request for the user 
userRouter.get('/user/requests/recieved',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', 'firstName lastName ');
        res.json({ connectionRequests })
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})


userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get('/feed',userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user; 
        const pageNumber = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.size) || 10;
        pageSize = pageSize > 50 ? 50 : pageSize;
        const findConnections = await connectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select( USER_SAFE_DATA);

        const hiddenUserSet = new Set([]);

        findConnections.forEach((connection) => {
            hiddenUserSet.add(connection.fromUserId);
            hiddenUserSet.add(connection.toUserId);
        });

        const userList = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUserSet) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip((pageNumber - 1) * pageSize).limit(pageSize);

        res.send({ userList });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = userRouter;
