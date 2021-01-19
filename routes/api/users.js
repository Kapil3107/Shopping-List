const express = require('express');
const router = express.Router(); // router is part of the router object
const bcrypt = require('bcryptjs');
const config = require('config'); // for bringing jwtSecret
const jwt = require('jsonwebtoken');

// Bringing the User Model (bz we need to make queries in Mongo)
const User = require('../../models/User');

// @route POST api/users
// @desc (description) Register new user
// @access Public (since don't have any authentication or authorization)
router.post('/', (req, res) => { // we want to fetch all the items from database
    const { name, email, password } = req.body;

    // Simple validation
    if(!name || !email || !password) {
        // bad request
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for existing user
    User.findOne({ email }) // email: email
        .then(user => { // if user does not exist then it'll be null
            if(user)
                return res.status(400).json({ msg: 'User already exists' });

            const newUser = new User({
                name,
                email,
                password
            })

            // creating salt which is used to create hash
            bcrypt.genSalt(10, (err, salt) => { // First parameter takes in the number of rounds we wanna use.(The higher the more secure but it also takes longer time - default is 10)
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {

                            // sign the token
                            jwt.sign(
                                // first add payload - we can have literally anything
                                { id: user.id },  // payload: so that we'll know which user id it is when the token comes from the postman or react
                                config.get('jwtSecret'),
                                { expiresIn: 3600 }, // optional
                                (err, token) => {
                                    if(err) throw err;
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
                        });
                })
            }) 
        })
});



module.exports = router;