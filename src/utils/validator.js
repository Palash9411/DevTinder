const validators = require('validator');

const validateSignUpData = (req ) =>{
    const { email, password , firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        throw new Error('Email, password, first name and last name are required');
    }
    if (!validators.isEmail(email)) {
        throw new Error('Invalid email format');
    }
    if (!validators.isStrongPassword(password)) {
        throw new Error('Weak password , Enter a strong password');
    }
}


const validateProfileEditData = (req) => {

    const { email, photoUrl, skills } = req.body;
    const allowedFields = ['firstName', 'lastName', 'email', 'gender', 'age', 'photoUrl', 'skills', 'about'];

    const isAllowed = Object.keys(req.body).every(field => allowedFields.includes(field));
    if (!isAllowed) {
        throw new Error(`Invalid Edit fields`);
    }

    if (email && !validators.isEmail(email)) {
        throw new Error('Invalid email format');
    }
    if (photoUrl && !validators.isURL(photoUrl)) {
        throw new Error('Invalid photo URL format');
    }
    if (skills && (!Array.isArray(skills) || skills.length === 0)) {
        throw new Error('Skills must be a non-empty array');
    }

    return isAllowed;
}

module.exports = {
    validateSignUpData,
    validateProfileEditData
};