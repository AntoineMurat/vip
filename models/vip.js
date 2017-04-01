let db = require(__dirname+'/../dbPromiseWrapper')
let photoModel = require(__dirname+"/photo")
let nationaliteModel = require(__dirname+"/nationalite")
let mariageModel = require(__dirname+"/mariage")
let liaisonModel = require(__dirname+"/liaison")

let acteurModel = require(__dirname+"/acteur")
let mannequinModel = require(__dirname+"/mannequin")
let chanteurModel = require(__dirname+"/chanteur")
let couturierModel = require(__dirname+"/couturier")
let realisateurModel = require(__dirname+"/realisateur")

let articleModel = require(__dirname+"/article")

module.exports.getPremieresLettresNoms = () =>  new Promise(
	(resolve, reject) => {

		let sql = `SELECT LEFT(VIP_NOM, 1) AS lettre 
        		   FROM vip 
        		   GROUP BY LEFT(VIP_NOM, 1)
        		   ORDER BY lettre;`

		db.query(sql).then(_firstLetters => {

			resolve(_firstLetters.map(ligne => ligne.lettre))

		}).catch(msg => {

			console.error(msg)
			reject("Erreur lors de la récupération des premières lettres.")

		})

	}
)

module.exports.findByFirstLetter = lettre => new Promise(
	(resolve, reject) => {

		let sql = `SELECT VIP_NUMERO AS id, VIP_NOM as nom,
				   VIP_PRENOM as prenom, VIP_SEXE as sexe,
				   VIP_NAISSANCE as naissance, VIP_TEXTE as biographie,
				   NATIONALITE_NUMERO as nationalite
				   FROM vip
				   WHERE VIP_NOM LIKE ?;`

		db.query(sql, [lettre+"%"]).then(_vips => {

			resolve(_vips)

		}).catch(msg => {

			console.error(msg)
			reject("Erreur lors de la récupération des vips dont le nom commence par ${lettre}.")

		})

	}
)

module.exports.findById = id => new Promise(
	(resolve, reject) => {

		let sql = `SELECT VIP_NUMERO AS id, VIP_NOM as nom,
				   VIP_PRENOM as prenom, VIP_SEXE as sexe,
        		   VIP_NAISSANCE as naissance, VIP_TEXTE as biographie,
        		   NATIONALITE_NUMERO as nationalite
        		   FROM vip
        		   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then(_vip => {

			if (_vip[0]){

				resolve(_vip[0])

			} else {

				reject(`Vip ${id} introuvable.`)

			}

		}).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de la récupération de la Vip ${id}.`)

		})
	}
)

module.exports.removeById = id => new Promise(
	(resolve, reject) => {

		let sql = `DELETE FROM vip
        		   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then(res => {

			if (res.affectedRows){

				resolve(true)

			} else {

				reject(`Vip ${id} introuvable.`)

			}

		}).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de la suppression de la Vip ${id}.`)

		})
	}
)

module.exports.find = () => new Promise(
	(resolve, reject) => {

		let sql = `SELECT VIP_NUMERO AS id, VIP_NOM as nom,
				   VIP_PRENOM as prenom, VIP_SEXE as sexe,
        		   VIP_NAISSANCE as naissance, VIP_TEXTE as biographie,
        		   NATIONALITE_NUMERO as nationalite
        		   FROM vip;`

		db.query(sql).then(_vips => {

			resolve(_vips)

		}).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de la récupération de l'ensemble des Vips.`)

		})
	}
)

module.exports.update = (vip) => new Promise(
	(resolve, reject) => {

		let sql = `UPDATE vip SET VIP_NOM = ?,
				   VIP_PRENOM = ?, VIP_SEXE = ?,
        		   VIP_NAISSANCE = ?, VIP_TEXTE = ?,
        		   NATIONALITE_NUMERO = ?
        		   WHERE VIP_NUMERO = ?;`

        console.log(vip)

		db.query(sql, [
			vip.nom, 
			vip.prenom,
			vip.sexe,
			new Date(vip.naissance).toISOString().substr(0, 19).replace('T', ' '),
			vip.biographie,
			vip.nationalite,
			vip.id
		]).then(res => {

			resolve(!!res.affectedRows)

		}).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de la modification de la Vip ${vip}.`)

		})
	}
)

module.exports.insert = (vip) => new Promise(
	(resolve, reject) => {

		let sql = `INSERT INTO vip SET ?;`

		db.query(sql, {
			VIP_NOM : vip.nom, 
			VIP_PRENOM : vip.prenom, 
			VIP_SEXE : vip.sexe, 
			VIP_NAISSANCE : vip.naissance, 
			VIP_TEXTE: vip.biographie, 
			NATIONALITE_NUMERO: vip.nationalite,
			VIP_DATE_INSERTION: new Date().toISOString().substr(0, 19).replace('T', ' ')
		}).then(res => {

			resolve(res.insertId)

		}).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de l'insertion de la Vip ${vip}.`)

		})
	}
)

module.exports.findWithArticle = () => new Promise(
	(resolve, reject) => {

		let sql = `SELECT c.VIP_NUMERO AS id, VIP_NOM as nom,
				   VIP_PRENOM as prenom, VIP_SEXE as sexe,
        		   VIP_NAISSANCE as naissance, VIP_TEXTE as biographie,
        		   NATIONALITE_NUMERO as nationalite
        		   FROM vip v
        		   JOIN comporte c ON c.VIP_NUMERO = v.VIP_NUMERO;`

		db.query(sql).then(_vips => {

			resolve(_vips)

		}).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de la récupération de l'ensemble des Vips.`)

		})
	}
)

module.exports.loadAttributes = (vip, attributes = new Set()) => new Promise(
	(resolve, reject) => {

		let defaultPromise = (toReturn) => new Promise((resolve, reject) => {resolve(toReturn)})

		// Liste de ce que l'on veut dans notre vip (hors base).

		// On peut demander :
		// photo
		// photos
		// nationalite
		// mariages
		// liaisons
		// professions
		// ...

		Promise.all([
			// Photo principale.
			(attributes.has('photo')) ? photoModel.findPhotoPrincipaleByVipId(vip.id) : defaultPromise(null),
			// Photos
			(attributes.has('photos')) ? photoModel.findByVipId(vip.id) : defaultPromise([]),
			// Nationalité
			(attributes.has('nationalité')) ? nationaliteModel.findById(vip.nationalite) : defaultPromise(vip.nationalite),
			// Mariage
			(attributes.has('mariages')) ? mariageModel.findByVipId(vip.id) : defaultPromise([]),
			// Liaisons
			(attributes.has('liaisons')) ? liaisonModel.findByVipId(vip.id) : defaultPromise([]),
			// Professions
			(attributes.has('professions')) ? acteurModel.findByVipId(vip.id) : defaultPromise(false),
			(attributes.has('professions')) ? mannequinModel.findByVipId(vip.id) : defaultPromise(false),
			(attributes.has('professions')) ? chanteurModel.findByVipId(vip.id) : defaultPromise(false),
			(attributes.has('professions')) ? couturierModel.findByVipId(vip.id) : defaultPromise(false),
			(attributes.has('professions')) ? realisateurModel.findByVipId(vip.id) : defaultPromise(false),
			// Articles
			(attributes.has('articles')) ? articleModel.findById(vip.id) : defaultPromise([]),

		]).then(results => {

			vip.photo = results[0]
			vip.photos = results[1]
			vip.nationalite = results[2]
			vip.mariages = results[3]
			vip.liaisons = results[4]

			vip.professions = {

				acteur : results[5],
				mannequin : results[6],
				chanteur : results[7],
				couturier : results[8],
				realisateur : results[9]

			}

			vip.articles = results[10]

			resolve(vip)

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors du chargement des attributs de la Vip ${vip.id}.`)
		
		})

	}
)