const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret_key = process.env.SECRET_KEY;
const {authenticateJwt} = require("../middleware/auth");
const {User} = require("../db/index")
const router = express.Router();
const {check, validationResult} = require('express-validator');

    router.post('/signup', [
        check('username').not().isEmpty().withMessage('Username is required'),
        check('password')
            .isLength({ max: 20})
            .withMessage('Password must be 1 to 20 characters long'),
        check('name').not().isEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Invalid email address'),
        check('number').isMobilePhone('any', {strictMode: false}).withMessage('Invalid phone number'),
    ], async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array() });
        }

        const {username, password, name, email, number} = req.body;
        const user = await User.findOne({username});

        if (user) {
            console.log(user)
            res.status(403).json({message: 'User already exists'})
        } else {
            const newUser = new User({ username, password, name, email, number})
            await newUser.save();
            const token = jwt.sign({username, role: 'user'}, secret_key, {expiresIn : '1h'});
            res.json({message: 'User created successfully', token});
        }
    });


    router.post('/login', [
        check('username').not().isEmpty().withMessage('Username is required'),
        check('password').not().isEmpty().withMessage('Password is required')
    ], async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const {username, password} = req.body;
        const user = await User.findOne({username, password});
        if (user) {
            const token = jwt.sign({username, role: 'user'}, secret_key, {expiresIn: '1h'});
            res.json({message: 'Logged In successfully', token});
        } else {
            res.status(403).json({message: 'Invalid username or password'});
        }
    });


    router.get("/me", authenticateJwt, async (req, res) => {
        const user = await User.findOne({username: req.user.username});
        if (!user) {
            return res.status(403).json({message: "user doesn't exist"})
            
        } 
        res.json({
            username: user.username
        })
    })


    router.get('/content/:username', authenticateJwt, async (req, res) => {
        const username = req.params.username;
        const userDetails = await User.findOne({username});
        res.json({userDetails})
    })

    router.put('/content/:username', async (req, res) => {
        const username = req.params.username;
        const {newPassword} = req.body;

        try {
            const user = await User.findOne({username});

            if (!user) {
                return res.status(404).json({message: "user not found"});
            }

            user.password = newPassword;

            await user.save();
            res.json({ message: "Password updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Failed to update password" });
        }
    })


    router.put('/about/:username', authenticateJwt, async (req, res) => {
        const {username} = req.params;
        const {password, name, email, number} = req.body;

        try {
            const user = await User.findOne({username});

            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            user.password = password;
            user.name = name;
            user.email = email;
            user.number = number;

            await user.save();
            return res.json({ message: "User details updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error updating user details" });
        }
    })

module.exports = router