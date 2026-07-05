const express = require ('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();

//get all the connection request for the user 
userRouter.get('/user/requests',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
    }catch{

    }
})

module.exports = userRouter;
