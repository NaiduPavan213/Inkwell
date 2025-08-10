const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // get the token from the request header
    const token = req.header('x-auth-token');
    //check if the token is not present
    if(!token){
        return res.status(401).json({ msg : 'No token , authorization denied.' });
    }
    // if token exists verify it
    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        // Add the user payload from the token to the request object
        req.user = decoded.user;
        next();
    } catch(err){
        if(err) {
            return res.status(401).json({ msg : 'token is not valid.'});
        }
    }
}