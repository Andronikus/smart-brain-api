const clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: process.env.CLARIFAI_API
});

const handleImageURL = (req, res) => {
	const {input} = req.body;
	app.models.predict(Clarifai.FACE_DETECT_MODEL,input)
		.then(response => {
			if(!response){
				return res.status(400).json('Ops! Something went wrong with image detection');
			}

			res.json(response.outputs[0].data);
		})
		.catch(err => {
			console.log('catch error', err);
		});
}


const handleImage = (db) => (req, res) => {
	const { id } = req.body;
	db('users')
  		.where('id', '=', id)
  		.increment('entries', 1)
  		.returning('entries')
  		.then(data => data.length > 0 ? res.json( {rank:data[0]} ) : res.status('404').json('cannot found user id'))
  		.catch(err => res.status('400').json('updated failed!'))
}

module.exports = {
	handleImage: handleImage,
	handleImageURL: handleImageURL
}