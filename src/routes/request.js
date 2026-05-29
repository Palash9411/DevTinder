const express   =    require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();

const User = require('../models/user');

requestRouter.post('/sendConnectionRequest', userAuth, (req, res) => {
    const user = req.user; 
    // Handle the request here
    console.log('Connection request sent');
    res.send(user.firstName + ' ' + 'sent a connection request');
});

module.exports = requestRouter;