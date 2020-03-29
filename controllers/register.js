const sessions = require('../utils/sessions');

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
								  .then( data => sessions.createSession(data[0]))
								  .then( session => res.json(session))
								  .catch(err => res.status(500).json('Something went wrong while register user!'))
								  })
    			  .then(trx.commit)
    			  .catch( err => {
						trx.rollback;
						const {detail} = err;
						if(detail.includes('already exists')){
							return res.status(500).json('user already exists!');
						}else{
							return res.status(500).json('Something went wrong!');
						}
    			  })
	})
	.catch(function(error) {
		console.log('error', error);
  		res.status(500).json('Something went wrong!');
	});
}

module.exports = {
    handleRegister: handleRegister
}