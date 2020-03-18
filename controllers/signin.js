const jwt = require('jsonwebtoken');
const redisClient = require('../database/redis');

const checkUser = (db, bcrypt, req) => {
	// go to database
	const { email, password } = req.body;

	if (!email || !password) {
		return Promise.reject('invalid parameters');
	}

	return db.select('email', 'hash')
		.from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);

			if (isValid) {
				// get and return user
				return db.select('*')
					.from('users')
					.where('email', '=', email)
					.then(data => data[0])
					.catch(err => Promise.reject('ups! something went wrong!'))
			} else {
				Promise.reject('incorrect credentials!')
			}
		})
		.catch(err => {
			console.log(err);
			Promise.reject(new Error(err))
		})
}

const signToken = email => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, 'JWT_SECRET');
}

const setToken = (key, value) => {
	return Promise.resolve(redisClient.set(key, value));
}

const createSessions = user => {
	const { id, email } = user;
	const token = signToken(email);

	return setToken(token, id)
		.then(() => {
			return { sucess: true, userId: id, token }
		})
		.catch(err => console.log(err));
}

const getAuthTokenId = (req, res) => {
	const { authorization } = req.headers;
	return redisClient.get(authorization, (err, reply) => {
		if (err || !reply) {
			return res.status(400).json('Unauthorized access!');
		}
		return res.json({ userId: reply });
	});
}

const handleSignInWithAuthentication = (db, bcrypt) => (req, res) => {
	const { authorization } = req.headers;

	if (authorization) {
		return getAuthTokenId(req, res);
	}

	checkUser(db, bcrypt, req)
		.then(user => user.id && user.email ? createSessions(user) : Promise.reject(user))
		.then(session => res.json(session))
		.catch(err => res.status(400).json(err))
}

module.exports = {
	handleSignInWithAuthentication: handleSignInWithAuthentication
}