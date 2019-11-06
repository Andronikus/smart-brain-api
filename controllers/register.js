const handleRegister = (db, bcrypt) => (req, res) => {
	const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json('invalid parameters');
    }
	
	const hash = bcrypt.hashSync(password);
		
	db.transaction( trx => {
  		return trx.insert({hash: hash, email: email})
    			  .into('login')
    			  .returning('email')
    			  .then( email  => {
      					return trx.insert({name: name, email: email[0], joined_at: new Date()})
    			  				  .into('users')
    							  .returning('*')
    							  .then( data => res.json(data[0]))
    			  })
    			  .then(trx.commit)
    			  .catch( err => {
    			  	trx.rollback;
    			  	const {detail} = err;
    			  	if(detail.includes('already exists')){
    			  		res.status(500).json('user already exists!');
    			  	}else{
    			  		res.status(500).json('Something went wrong!');
    			  	}
    			  })
	})
	.catch(function(error) {
  		res.status(500).json('Something went wrong!');
	});
}

module.exports = {
    handleRegister: handleRegister
}