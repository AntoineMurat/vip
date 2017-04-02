let crypto = require('crypto')
let vipModel = require(__dirname+"/../models/vip")
let photoModel = require(__dirname+"/../models/photo")
let nationaliteModel = require(__dirname+"/../models/nationalite")
let maisondisqueModel = require(__dirname+"/../models/maisondisque")
let filmModel = require(__dirname+"/../models/film")
let agenceModel = require(__dirname+"/../models/agence")
let defileModel = require(__dirname+"/../models/defile")
let realisateurModel = require(__dirname+"/../models/realisateur")
let chanteurModel = require(__dirname+"/../models/chanteur")
let acteurModel = require(__dirname+"/../models/acteur")
let liaisonModel = require(__dirname+"/../models/liaison")
let mariageModel = require(__dirname+"/../models/mariage")
let mannequinModel = require(__dirname+"/../models/mannequin")
let couturierModel = require(__dirname+"/../models/couturier")

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

	let id
	
	vipModel.insert(req.body).then(_id => {

		id =_id

		let todo = []

		// Liaisons.

		let liaisons = (!req.body.liaisonConjoint) ? [] : req.body.liaisonConjoint.map((conjoint, index) => ({
				vip: id, 
				conjoint: conjoint, 
				date: req.body.liaisonDate[index],
				motiffin: liaisonMotiffin[index]
			}))

		todo = [...todo, ...liaisons.map(liaison => liaisonModel.insert(liaison))]

		// Mariages

		let mariages = (!req.body.mariageConjoint) ? [] : req.body.mariageConjoint.map((conjoint, index) => ({
				vip: id, 
				conjoint: conjoint, 
				lieu: req.body.mariageLieu[index],
				debut: req.body.mariageDebut[index], 
				fin: req.body.mariageFin[index],
				motiffin: liaisonMotiffin[index]
			}))

		todo = [...todo, ...mariages.map(mariage => mariageModel.insert(mariage))]

		// Réalisateur

		let filmsRealises = (!req.body.filmTitre) ? [] : req.body.filmTitre.map((conjoint, index) => ({
				vip: id, 
				date: req.body.filmDate[index],
				titre: req.body.filmTitre[index]
			}))

		if (filmsRealises.length)
			todo.push(realisateurModel.insert(id, filmsRealises))

		// Acteur acteurDebut

		let joue = (!req.body.filmId) ? [] : req.body.filmId.map((filmdId, index) => ({
				film: filmId,
				role: req.body.filmRole[index],
				vip: id
			}))

		if (joue.length)
			todo.push(acteurModel.insert({
				debut: req.body.acteurDebut,
				vip: id
			}, joue))

		// Chanteur chanteurSpecialite

		let albums = (!req.body.albumTitre) ? [] : req.body.albumTitre.map((titre, index) => ({
				titre: titre,
				date: req.body.albumDate[index],
				maisondisque: req.body.albumMaisonDisque[index]
			}))

		if (albums.length)
			todo.push(chanteurModel.insert({
				vip: id,
				specialite: req.body.specialite
			}, albums))

		// Mannequin mannequinTaille

		let defilesParticipes = (!req.body.mannequinDefile) ? [] : req.body.mannequinDefile.map(defile => ({
				defile: defile,
				vip: id
			}))

		if (defilesParticipes.length)
			todo.push(mannequinModel.insert({
				vip: id,
				taille: req.body.mannequinTaille
			}, defilesParticipes))

		// Couturier

		let defiles = (!req.body.defileLieu) ? [] : req.body.defileLieu.map((lieu, index) => ({
				lieu: lieu,
				date: req.body.defileDate[index],
				vip: vip
			}))

		if (defiles.length)
			todo.push(couturierModel.insert({
				vip: id
			}, defiles))

		return Promise.all(todo)

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