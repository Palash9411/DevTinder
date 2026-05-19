const mongoose= require('mongoose');
const Schema = mongoose.Schema;


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
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate (value) {
            const genders = ['male', 'female', 'other'];
            if(!genders.includes(value)) {
                throw new Error('Invalid gender');
            }
            return true;
        }

    },
    photoUrl : {
        type: String,
        default: 'https://ashallendesign.co.uk/blog/13-placeholder-avatar-and-image-websites'
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