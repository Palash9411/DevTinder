const express = require ('express');
const connectDB = require('./configs/database');
const app = express();
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());


const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const requestRoutes = require('./routes/request');

app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use("/", requestRoutes);

connectDB().then(() => {
    console.log("Database connection established ");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((error) => {
    console.error("Database connection error:", error);
});

