const express = require('express');
const router = express.Router(); // router is part of the router object
const bcrypt = require('bcryptjs');
const config = require('config'); // for bringing jwtSecret
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// Bringing the User Model (bz we need to make queries in Mongo)
const User = require('../../models/User');

// @route POST api/auth
// @desc (description) Authenticate the user
// @access Public (since don't have any authentication or authorization) - it will come publicly but we will send it privately
router.post('/', (req, res) => { // we want to fetch all the items from database
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        // bad request
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for existing user
    User.findOne({ email }) // email: email
        .then(user => { // if user does not exist then it'll be null
            if (!user)
                return res.status(400).json({ msg: 'User does not exist' });

            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

                    // if matches, we wanna send the token and the user, just like we did in our registration
                    jwt.sign(
                        // first add payload - we can have literally anything
                        { id: user.id },  // payload: so that we'll know which user id it is when the token comes from the postman or react
                        config.get('jwtSecret'),
                        { expiresIn: 3600 }, // optional (user will be logged in for 1 hour only)
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            })
                        }
                    )
                })
        })
});


// @route GET api/auth/user
// @desc (description) Get user data - this will validate the user with the token (it'll help the user stay logged in)
// @access Private
router.get('/user', auth, (req, res) => { // this will give us the user for which this token belongs to
    User.findById(req.user.id) // since id is included in the token
        .select('-password') // since we don't want to return password, so this will just disregard the password
        .then(user => res.json(user));
})


module.exports = router;