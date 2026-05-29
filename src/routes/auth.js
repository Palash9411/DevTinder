const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

authRouter.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        // validating the data 
        validateSignUpData(req);
        // encrypting the data 
        const hashedPassword = await bcrypt.hash(password, 10);
        // saving the user 
        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();
        res.send('User created successfully');
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send(error.message);
    }
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('Invalid Credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid Credentials');
        }
        const token = jwt.sign({ userId: user._id }, 'DEVELOPMENT$123',{
            expiresIn: '7d'
        });
        res.cookie('token', token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        res.send('Login successful');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = authRouter;
