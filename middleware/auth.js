const config = require('config');
const jwt = require('jsonwebtoken');

// Middleware function - purpose of this middleware fn is to get the token that's sent from frontend and then send along the token
function auth(req, res, next) {
    const token = req.header('x-auth-token'); // that's the header value we wanna check for token

    // Check for token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' }); // 401 means you don't have correct permissions (UNAUTHORISED)
    }

    try {
        // verify the token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        // Add user from payload
        req.user = decoded;  // we'll take user id from the payload which was set before and we want to put that into req.user so that way whenever the token is sent we have that user stored in the req value
        next(); // calls the next piece of middleware

    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }

}

// now whenever we want a private route, we can symply add this piece of middleware as the second parameter in the endpoints.

module.exports = auth;