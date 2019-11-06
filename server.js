const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// initialize database connection
const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'andronikus',
		password:'',
		database: 'smart-brain'
	}
})

// create server
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//routes
app.post('/signin', signin.handleSignIn(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfileGetByID(db));
app.put('/image', image.handleImage(db));
app.post('/imageURL', (req, res) => image.handleImageURL(req, res));

// server listen port
app.listen(3001, () => console.log("I'm running on port 3001"));
