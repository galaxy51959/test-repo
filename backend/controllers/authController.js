const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            if (
                email.toLowerCase() === process.env.EMAIL_USER.toLowerCase() &&
                password === process.env.EMAIL_PASSWORD
            ) {
                const newUser = new User({
                    email: process.env.EMAIL_USER,
                    password: process.env.EMAIL_PASSWORD,
                    firstName: 'Alexis',
                    lastName: 'Carter',
                });
                await newUser.save();
            } else {
                return res
                    .status(401)
                    .json({ message: 'Invalid email or password' });
            }
        } else {
            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );
            if (!isValidPassword) {
                return res
                    .status(401)
                    .json({ message: 'Invalid email or password' });
            }
        }

        const findUser = await User.findOne({ email: email });

        // Generate JWT token
        const token = jwt.sign(
            { id: findUser._id, email: findUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: findUser._id,
                email: findUser.email,
                firstName: findUser.firstName,
                lastName: findUser.lastName,
            },
        });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
