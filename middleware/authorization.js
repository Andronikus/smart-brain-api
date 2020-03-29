const redisClient = require('../database/redis');

const authorize = (req, res, next) => {
    const {authorization} = req.headers;

    console.log('authorization::', authorization);

    if(!authorization || authorization === 'null' ){
        return res.status(401).json('Unauthorized access');
    }

    redisClient.get(authorization, (err, reply) =>{
        
        console.log('err::', err, 'reply', reply);

        if(err || !reply){
            return res.status(401).json('Unauthorized access');
        }
        next();
    })
}

module.exports = {
    authorize
}