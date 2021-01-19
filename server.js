const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

const path = require('path');

const app = express();

// Body parser middleware
app.use(express.json());

// DB config
const db = config.get('mongoURI');

// connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }) //this is promise based
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Use Routes
app.use('/api/items', require('./routes/api/items')) // anything that goes to /api/items should refer to the file items.js
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

// Serve static routes (which is that build folder) if in production
if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build')); // so if in production it'll load the build folder (setting the static folder)

    app.get('*', (req, res) => { // * -> anything. So any request we get that's not /api/items will load the index.html
        // here we wanna just load the index.html file
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));