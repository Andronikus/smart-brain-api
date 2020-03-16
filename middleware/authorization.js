const redisClient = require('../database/redis');

const authorize = (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization){
        res.status(401).json('Unauthorized access');
    }

    redisClient.get(authorization, (err, reply) =>{
        if(err || !reply){
            res.status(401).json('Unauthorized access');
        }
        next();
    })
}

module.exports = {
    authorize
}