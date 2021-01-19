const express = require('express');
const router = express.Router(); // router is part of the router object
const auth = require('../../middleware/auth');

// Bringing the Item Model (bz we need to make queries in Mongo)
const Item = require('../../models/Item');

// @route GET api/items
// @desc (description) Get All Items
// @access Public (since don't have any authentication or authorization)
router.get('/', (req, res) => { // we want to fetch all the items from database
    Item.find() // returns a promise
        .sort({ date: -1 }) //sorting in descending order
        .then (items => res.json(items));
});


// @route POST api/items
// @desc (description) Create An Item 
// @access Private (since now we have auth)
router.post('/', auth, (req, res) => { // we want to fetch all the items from database
    // constructing an object to insert in the database
    const newItem = new Item({
        name: req.body.name  // using the body parser allows us to do this
    })

    newItem.save().then(item => res.json(item));
});

// @route DELETE api/items/:id
// @desc (description) Delete An Item
// @access Private (since now we have auth)
router.delete('/:id', auth, (req, res) => { // we want to fetch all the items from database
    // First find then remove
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false })) // if the id does not exist
});


module.exports = router;