const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = new express.Router();
const bcrypt = require('bcryptjs');

// @route POST /users
// @desc Create new user
// @access Public
router.post('/api/users', async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User(req.body);

    if(!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' })
    }

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch(e) {
        if(e.message.includes(`password`)) {
            return res.status(400).send({ message: 'Password too short. Must be 5 or more characters' });
        }

        res.status(400).send({ message: 'User already exists' });
    }
});

// @route POST /users/login
// @desc Login user
// @access Public
router.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if(!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' })
    }

    await User.findOne({ email })
        .then(user => {
            if(!user) {
                return res.status(400).json({ message: 'User does not exist' });
            }
        });

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch(e) {
        res.status(400).send({ message: 'Invalid credentials' });
    }
});

// @route POST /users/logout
// @desc Logout user
// @access Private
router.post('/api/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

// @route GET /users/me
// @desc Get user data
// @access Private
router.get('/api/users/me', auth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;