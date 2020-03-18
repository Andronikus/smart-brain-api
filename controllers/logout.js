const redisClient = require('../database/redis');

const handleLogout = (req, res) => {

    const { sessionToken } = req.body;

    console.log('sessionToken', sessionToken);
    
    return redisClient.del(sessionToken, (err, result) => {
        if(err){
            console.log(err);
        }
        return res.json('logout ok');
    })
}

module.exports = {
    handleLogout
}