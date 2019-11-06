const handleProfileGetByID = (db) => (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
		.then( user => user.length > 0 ? res.json(user[0]) : res.status('404').json('user not found!'))
		.catch(err => res.status('400').json('Something went wrong!'));
}

module.exports = {
	handleProfileGetByID: handleProfileGetByID
}