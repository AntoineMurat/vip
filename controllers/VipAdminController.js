let crypto = require('crypto')
let vipModel = require(__dirname+"/../models/vip")
let photoModel = require(__dirname+"/../models/photo")
let nationaliteModel = require(__dirname+"/../models/nationalite")
let maisondisqueModel = require(__dirname+"/../models/maisondisque")
let filmModel = require(__dirname+"/../models/film")
let agenceModel = require(__dirname+"/../models/agence")
let defileModel = require(__dirname+"/../models/defile")

module.exports.Ajouter = (req, res) => {

	Promise.all([
		nationaliteModel.find(),
		maisondisqueModel.find(),
		vipModel.find(),
		filmModel.find(),
		agenceModel.find(),
		defileModel.find()
	]).then(results => {

		[res.nationalites,
		 res.maisonsDisque, 
		 res.vips, 
		 res.films, 
		 res.agences, 
		 res.defiles] = results

		res.title = "Ajout d'une VIP."

		res.render('ajouterVip', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}

module.exports.ModifierSelection = (req, res) => {

	vipModel.find().then(vips => {

		res.vips = vips

		res.title = "Modification d'un VIP." 

		res.page = req.params.page

		res.render('modifierVipSelection', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})
}

module.exports.Modifier = (req, res) => {

	Promise.all([

		vipModel.findById(req.params.id),

		nationaliteModel.find()
	
	]).then(results => {

		[res.vip, res.nationalites] = results

		res.title = `Modification de ${res.vip.prenom} ${res.vip.nom}.`

		res.render('modifierVip', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}

module.exports.Supprimer = (req, res) => {

	vipModel.find().then(vips => {

		res.vips = vips

		res.title = "Suppression d'un VIP." 

		res.page = req.params.page

		res.render('supprimerVip', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}

module.exports.AjouterPOST = (req, res) => {

	vipModel.insert(req.body).then(id => {

		req.body.vip = id;
		req.body.adresse = crypto.createHash('sha256').update(''+Math.random()).digest('hex').slice(32)+"."+req.files.photo.name.split('.')[1]

		req.files.photo.mv(__dirname+'/../public/images/vip/'+req.body.adresse, err => {

			if (err){

				res.status(500).send(err)	
			
			} else {

				return photoModel.insert(req.body)

			}

		})

	}).then(insertId => {

		res.render("succes")

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}

module.exports.ModifierSelectionPOST = (req, res) => {

	res.redirect(`/vip/modifier/${req.body.vip}`)

}

module.exports.ModifierPOST = (req, res) => {

	req.body.id = req.params.id;

	// On vérifie si on a envoyé l'image.

	if (req.files && req.files.photo){

		photoModel.removeByVipById(req.params.id, 1).then(() => 

			vipModel.update(req.body)

		).then(() => {

			req.body.adresse = crypto.createHash('sha256').update(''+Math.random()).digest('base64')+"."+req.files.photo.name.split('.')[1]

			req.files.photo.mv(__dirname+'/../public/images/vip/'+req.body.adresse, err => {

				if (err){
	      			res.status(500).send(err)
				} else {
					return photoModel.insert(req.body)
				}

			})


		}).then(() => {

			res.render("succes")

		}).catch(msg => {

			console.error(msg)
			return res.status(500).send(msg)

		})

	} else {

		vipModel.update(req.body).then(() => {

			res.render("succes")

		}).catch(msg => {

			console.error(msg)
			return res.status(500).send(msg)

		})

	}

}

module.exports.SupprimerPOST = (req, res) => {

	photoModel.removeByVip(req.body.vip).then(() =>

		vipModel.removeById(req.body.vip)

	).then( () => {

		res.render("succes")

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})
	
}