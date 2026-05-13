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

connectDB().then(() => {
    console.log("Database connection established ");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((error) => {
    console.error("Database connection error:", error);
});

