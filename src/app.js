const express = require ('express');
const connectDB = require('./configs/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validator');
const bcrypt = require('bcrypt');

app.use(express.json());

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
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
        res.send('Login successful');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// get data of one user 

app.get('/user', async (req, res) => {
    const email = req.body.email;
    try{
        const user = await User.find({ email });
        if (!user || user.length === 0) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/feed', async (req, res) => {
    try {
        const feed = await User.find({});
        res.send(feed);
    } catch (error) {
        console.error("Error fetching feed:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findOneAndDelete({ _id: userId });
        res.send('User deleted successfully');
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const updates = req.body;
    try {
        const ALLOWED_UPDATES = ['firstName', 'lastName', , 'age', 'gender', 'photoUrl', 'about', 'skills'];
        const isValidUpdate = Object.keys(updates).every(key => ALLOWED_UPDATES.includes(key));
        if (!isValidUpdate) {
            throw new Error('Invalid update fields');
        }
        if(updates.skills.length > 10) {
            throw new Error('Too many skills');
        }
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, updates, {
            new: true,
            runValidators: true
        });
        res.send(updatedUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

connectDB().then(() => {
    console.log("Database connection established ");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((error) => {
    console.error("Database connection error:", error);
});

