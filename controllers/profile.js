const handleProfileGetByID = (db) => (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({ id })
		.then(user => user.length > 0 ? res.json(user[0]) : res.status('404').json('user not found!'))
		.catch(err => res.status('400').json('Something went wrong!'));
}

const handleProfileUpdateByID = (db) => (req, res) => {
	const { id } = req.params;
	const { name } = req.body.formProfile;
	db('users')
		.where({ id })
		.update({ name })
		.then(result => {
			if (result) {
				res.json('profile updated successfully');
			} else {
				res.status(400).json('error updating profile');
			}
		})
		.catch(err => {
			res.status(400).json('error updating profile', err.message);
		})
}

module.exports = {
	handleProfileGetByID,
	handleProfileUpdateByID
}