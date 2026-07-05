const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const userSchema = new Schema({
    firstName : {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 100
    },
    lastName: {
        type: String,
    },  
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
            return true;
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Weak password , Enter a strong password');
            }
            return true;
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        enum : {
            values : ['male', 'female', 'other'],
            message : `{VALUE} is not a valid gender`
        },
        // validate (value) {
        //     const genders = ['male', 'female', 'other'];
        //     if(!genders.includes(value)) {
        //         throw new Error('Invalid gender');
        //     }
        //     return true;
        // }

    },
    photoUrl : {
        type: String,
        default: 'https://ashallendesign.co.uk/blog/13-placeholder-avatar-and-image-websites',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid URL format');
            }
            return true;
        }
    },
    about: {
        type: String,
        default: 'Hello, I am using DevTinder!',
    },
    skills : {
        type : [String],
        default: []
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;