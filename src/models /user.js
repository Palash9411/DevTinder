const mongoose= require('mongoose');
const {Schema} = mongoose.Schema;


const userSchema = Schema({
    firstName : {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
       
    },
    password: {
        type: String,
        
    },
    age: {
        type: Number,
       
    },
    gender: {
        type: String,
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;