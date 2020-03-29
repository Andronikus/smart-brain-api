const jwt = require('./jwt');
const redisClient = require('../database/redis');

const setToken = (key, value) => {
	return Promise.resolve(redisClient.set(key, value));
}

const createSession = user => {
	const { id, email } = user;
	const token = jwt.signToken({ email });

	return setToken(token, id)
		.then(() => {
			return { success: true, userId: id, token }
		})
		.catch(err => console.log(err));
}

module.exports = {
    createSession
}