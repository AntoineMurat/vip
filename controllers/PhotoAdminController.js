let crypto = require('crypto')
let vipModel = require(__dirname+"/../models/vip")
let photoModel = require(__dirname+"/../models/photo")

module.exports.Ajouter = (req, res) => {

	vipModel.find().then(vips => {

		res.vips = vips

		res.title = `Ajout d'une nouvelle photo`

		res.render('ajouterPhoto', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}

module.exports.Supprimer = (req, res) => {

	vipModel.find().then(vips => {

		return Promise.all(
			vips.map((vip) => vipModel.loadAttributes(vip, new Set(['photos'])))
		)

	}).then(vips => {

		res.vips = vips

		res.render('supprimerPhoto', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}

module.exports.AjouterPOST = (req, res) => {

	new Promise((resolve, reject) => {

		req.body.adresse = crypto.createHash('sha256').update(''+Math.random()).digest('hex').slice(32)+"."+req.files.photo.name.split('.')[1]

		req.files.photo.mv(__dirname+'/../public/images/vip/'+req.body.adresse, err => {

			if (err)
				reject(err)

      		resolve(true)
      		
		})

	}).then(() =>

		photoModel.insert(req.body)
	
	).then(() => {

		res.render("succes")

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}

module.exports.SupprimerPOST = (req, res) => {

	photoModel.removeByVipById(req.body.vip, req.body.id).then(() => {

		res.render("succes")

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}