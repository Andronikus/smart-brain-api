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
		host: process.env.DATABASE_URL,
		ssl: true,
	}
})

// create server
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//routes
app.post('/', (req,res) => res.json("oh yeah. I am online"));
app.post('/signin', signin.handleSignIn(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfileGetByID(db));
app.put('/image', image.handleImage(db));
app.post('/imageURL', (req, res) => image.handleImageURL(req, res));

// server listen port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`I'm running on port ${PORT}`));