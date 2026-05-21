const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req,res,next)=>{
  try { 
        const cookies = req.cookies;
        const {token} = cookies;

        if (!token) {
            return res.status(401).send('Invalid token');
        }

        const decodedMessage = await jwt.verify(token, 'DEVELOPMENT$123');

        const _id = decodedMessage.userId;

        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send('User not found');
        }
        req.user = user;
        next();
  } catch (error) {
      console.error("Error in userAuth middleware:", error);
      res.status(500).send('Internal Server Error');
  }
}

module.exports = {userAuth  };