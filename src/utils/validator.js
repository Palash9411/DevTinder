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

module.exports = {
    validateSignUpData
};