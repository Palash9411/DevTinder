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
        }).populate('fromUserId', 'firstName lastName ');
        res.json({ connectionRequests })
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})


userRouter.get('feed',userAuth,async(req,res)=>{
    try {
       //User should see all the cards except 
       //0. his own card 
       //1. his connecttions 
       //2. ignored people 
       //3. already sent the connection request .

        const loggedInUser = req.user; 

        const connectionRequests = await connectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        });

        res.send({ connectionRequests });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = userRouter;
