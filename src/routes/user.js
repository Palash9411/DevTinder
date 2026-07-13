const express = require ('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

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


userRouter.get('/feed',userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user; 
        const pageNumber = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.size) || 10;
        pageSize = pageSize > 50 ? 50 : pageSize;
        const findConnections = await connectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select('fromUserId toUserId');

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
        }).select('firstName lastName age gender').skip((pageNumber - 1) * pageSize).limit(pageSize);

        res.send({ userList });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = userRouter;
