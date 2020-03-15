const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// initialize database connection
const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.POSTGRES_URI,
		ssl: false,
	}
})

// create server
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

//routes
app.get('/', (req, res) => res.json("oh yeah. I am online"));
app.post('/signin', signin.handleSignInWithAuthentication(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfileGetByID(db));
app.post('/profile/:id', profile.handleProfileUpdateByID(db));
app.put('/image', image.handleImage(db));
app.post('/imageURL', (req, res) => image.handleImageURL(req, res));

// server listen port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`I'm running on port ${PORT}`));