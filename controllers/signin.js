const handleSignIn = (db, bcrypt) => (req, res) => {
	// go to database
	const {email, password} = req.body;

	if(!email || !password){
		return res.status(400).json('invalid parameters');
	}

	db.select('email', 'hash')
	  .from('login')
	  .where('email', '=', email)
	  .then( data => {
	  		const isValid = bcrypt.compareSync(password, data[0].hash);

	  		if(isValid){
	  			// get and return user
	  			return db.select('*')
	  			  		 .from('users')
	  			  		 .where('email', '=', email)
	  			  	     .then( data => res.json(data[0]) )
	  			  		 .catch( err => res.status(400).json('ups! something went wrong!'))
	  		}else{
	  			res.status(400).json('incorrect credentials!')
	  		}
	  })
	  .catch(err => res.status(400).json('wrong user name or password!'))
}

module.exports = {
	handleSignIn: handleSignIn
}