const express = require ('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const connectionRequest = require('../models/connectionRequest');

//get all the connection request for the user 
userRouter.get('/user/requests/recieved',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', 'firstName lastName age gender about skills');
        res.json({ connectionRequests });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

module.exports = userRouter;
