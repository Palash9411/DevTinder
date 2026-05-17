const express = require ('express');
const connectDB = require('./configs/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post('/signup', async (req, res) => {
    const newUser = new User(req.body);
    try {
        await newUser.save();
        res.send('User created successfully');
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send('Internal Server Error');
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

app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const updates = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, updates, {
            new: true,
        });
        res.send(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send('Internal Server Error');
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

