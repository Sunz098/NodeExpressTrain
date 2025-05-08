const jwt = require('jsonwebtoken');


module.exports = function(req, res, next) {
    try {
        let token = req.headers.authorization
        if(!token){
            return res.status(401).send("Unauthorized")
        }
        req.auth = token
        next()
    } catch (error) {
        res.status(500).send(error)
    }
}