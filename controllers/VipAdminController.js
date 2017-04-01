let crypto = require('crypto')
let vipModel = require(__dirname+"/../models/vip")
let photoModel = require(__dirname+"/../models/photo")
let nationaliteModel = require(__dirname+"/../models/nationalite")
let realisateurModel = require(__dirname+"/../models/realisateur")
let chanteurModel = require(__dirname+"/../models/chanteur")

module.exports.Ajouter = (req, res) => {

	nationaliteModel.find().then(nationalites => {

		res.nationalites = nationalites

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

	let id
	
	vipModel.insert(req.body).then(_id => {

		id =_id

		return Promise.all([

				realisateurModel.insert(
						{id : id},
						[{
							titre : 'nouveauFilm',
							date : '1111-11-11',
							realisateur : id
						}]
					),
				acteurModel.insert(
						{id : id, debut : '1111-11-11'},
						[{
							idFilm : 12,
							role_nom : 'servant',
							acteur : id
						}]
					),
				chanteurModel.insert(
						{id : id, specialite : 'tro fort'},
						[{
							id : 1,
							maisonDisque : 1,
							titre : 'la joyeuse',
							date : '2222-22-22'
						}]
					)

			])

	}).then(() => {

		console.log(id)
		req.body.vip = id
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

	if (req.files.photo){

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

			res.redirect("/")

		}).catch(msg => {

			console.error(msg)
			return res.status(500).send(msg)

		})

	}

}

module.exports.SupprimerPOST = (req, res) => {

	vipModel.removeById(req.body.vip).then(() => {

		res.render("succes")

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})
	
}