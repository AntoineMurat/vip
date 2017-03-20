let vipModel = require(__dirname+"/../models/vip")

// ///////////////////////// R E P E R T O I R E    D E S     S T A R S

module.exports.Repertoire = (req, res) => {
	
	res.title = 'Répertoire des stars';

	vipModel.getPremieresLettresNoms().then(lettres => {

		res.premieresLettres = lettres

		res.render('repertoire', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

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
				vips => Promise.all(
					vips.map(vip => vipModel.loadAttributes(vip, new Set(['photo'])))
				)

			).then(vips => {

				resolve(vips)

			}).catch(msg => {

				console.error(msg)
				reject(`Erreur lors de la récupérations des Vips.`)
				return res.status(500).send(msg)

			})


		})

	]).then(results => {

		[res.premieresLettres, res.vips] = results

		res.render('repertoire', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})
      
}

module.exports.DetailsPourVip = (req, res) => {

	Promise.all([
		// On a besoin des premières lettres.
		vipModel.getPremieresLettresNoms(),

		// En parallèle, on récupère le vip.
		new Promise((resolve, reject) => {
			vipModel.findById(req.params.id).then(
				vip => vipModel.loadAttributes(
					vip, 
					new Set(['photo', 'photos', 'nationalité', 'mariages', 'liaisons', 'professions'])
				)
			).then(vip => {

				resolve(vip)

			}).catch(msg => {

				console.error(msg)
				return res.status(500).send(msg)

			})
		})
		

	]).then(results => {

		[res.premieresLettres, res.vip] = results

		// On élimine la première photo.
		res.vip.photos = res.vip.photos.filter((photo) => photo.numero != 1)

		res.title = `Détails de ${res.vip.prenom} ${res.vip.nom}`

		res.render('details', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})
      
}

module.exports.JSONPreview = (req, res) => {

	vipModel.findById(req.params.id).then(vip => 
		
		vipModel.loadAttributes(vip, new Set(['photo']))
	
	).then(vip => {

		res.json({vip: vip})

	}).catch(msg => {

		console.error(msg)

		res.json({err: msg})

	})

}