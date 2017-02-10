let vipModel = require(__dirname+"/../models/vip")

// ///////////////////////// R E P E R T O I R E    D E S     S T A R S

module.exports.Repertoire = (req, res) => {
	
	res.title = 'Répertoire des stars';

	vipModel.getPremieresLettresNoms().then((lettres) => {

		res.premieresLettres = lettres

		res.render('repertoireVips', res)

	}).catch((msg) => {

		console.log(msg)

		// res.render erreur avec message

	})
      
}

module.exports.CommencantParLettre = (req, res) => {
	
	res.title = `Répertoire des stars dont le nom commence par ${req.params.lettre}`
	
	Promise.all([
		// On a besoin des premières lettres.
		vipModel.getPremieresLettresNoms(),

		// En parallèle, on récupère la liste des vips.
		new Promise((resolve, reject) => {

			vipModel.findByFirstLetter(req.params.lettre).then(

				// On charge ensuite les attributs dont on a besoin pour chacun des vips.
				(vips) => Promise.all(
					vips.map((vip) => vipModel.loadAttributes(vip, new Set(['photo'])))
				)

			).then((vips) => {

				resolve(vips)

			}).catch((msg) => {

				console.log(msg)
				reject(`Erreur lors de la récupérations des Vips.`)

			})


		})

	]).then((results) => {

		res.premieresLettres = results[0]
		res.vips = results[1]

		res.render('repertoireVips', res)

	}).catch((msg) => {

		console.log(msg)

		// res.render erreur avec message

	})
      
}

module.exports.DetailsPourVip = (req, res) => {

	Promise.all([
		// On a besoin des premières lettres.
		vipModel.getPremieresLettresNoms(),

		// En parallèle, on récupère le vip.
		new Promise((resolve, reject) => {
			vipModel.findById(req.params.id).then(
				(vip) => vipModel.loadAttributes(
					vip, 
					new Set(['photo', 'photos', 'nationalité', 'mariages', 'liaisons', 'professions'])
				)
			).then((vip) => {

				resolve(vip)

			}).catch((msg) => {

				console.log(msg)

				// res.render erreur avec message

			})
		})
		

	]).then((results) => {

		res.premieresLettres = results[0]
		res.vip = results[1]

		res.title = `Détails de ${res.vip.prenom} ${res.vip.nom}`

		res.render('detailsVip', res)

	}).catch((msg) => {

		console.log(msg)

		// res.render erreur avec message

	})
      
}
