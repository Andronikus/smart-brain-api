const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URI);

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
		.catch(err => Promise.reject('wrong user name or password!'))
}

const signToken = email => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, 'JWT_SECRET');
}

const createSessions = user => {
	const { id, email } = user;
	const token = signToken(email);

	return { sucess: true, userId: id, token }
}

const handleSignInWithAuthentication = (db, bcrypt) => (req, res) => {
	const { authorization } = req.headers;

	if (authorization) {
		return res.json('user already sign in');
	}

	checkUser(db, bcrypt, req)
		.then(user => user.id && user.email ? createSessions(user) : Promise.reject(user))
		.then(session => res.json(session))
		.catch(err => res.status(400).json(err))
}

module.exports = {
	handleSignInWithAuthentication: handleSignInWithAuthentication
}