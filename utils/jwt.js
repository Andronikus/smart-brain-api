const jwt = require('jsonwebtoken');

const signToken = payload => {
	return jwt.sign(payload, 'JWT_SECRET');
}

module.exports = {
    signToken
}