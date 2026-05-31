const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { validateProfileEditData } = require('../utils/validator');

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send('Internal Server Error');
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        console.log("Received profile edit request with data:", req.body);
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid Profile data");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();
        res.json({
            message : `${loggedInUser.firstName} ${loggedInUser.lastName}'s profile updated successfully`,
            user: loggedInUser
        })

    } catch (error) {
        console.error("Error editing user profile:", error);
        res.status(500).send('Internal Server Error');
    }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const { email , newPassword } = req.body;
        const loggedInUser = req.user;

        if (!email || !newPassword) {
            return res.status(400).json({ error: 'Email and new password are required' });
        }

       const isMatch = email === loggedInUser.email;
        if (!isMatch) {
            return res.status(401).json({ error: 'Email is incorrect' });
        }

        loggedInUser.password =  await bcrypt.hash(newPassword, 10);
        await loggedInUser.save();

    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = profileRouter;