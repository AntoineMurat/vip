let db = require(__dirname+'/../dbPromiseWrapper')
let filmModel = require(__dirname+'/film')

module.exports.insert = (acteur, joue = array()) => new Promise(
	(resolve, reject) => {

		let sql = `INSERT INTO acteur SET ?;`

		db.query(sql, {
			VIP_NUMERO : acteur.vip,
			ACTEUR_DATEDEBUT : new Date(acteur.debut).toISOString().substr(0, 19).replace('T', ' ')
		}).then(res => {

			let tabActeur = joue.map(film => filmModel.insertActeur(film))

			return Promise.All(tabActeur)

		}).then(() => resolve(true)).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de l'insertion de l'acteur ${acteur.id}.`)

		})
	}
)

module.exports.findByVipId = id => new Promise(
	(resolve, reject) => {

		let errorHandler = msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération de la profession d'acteur de la Vip ${id}.`)

		}

		let acteur

        let sql = `SELECT ACTEUR_DATEDEBUT as debut,
        		   VIP_NUMERO as id
				   FROM acteur
				   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then(_acteur => {

			if (_acteur.length == 0){
				
				resolve(false)
				return
			
			} 

			acteur = _acteur[0]

			filmModel.findByActeurId(id).then(_films => {

				acteur.films = _films

				resolve(acteur)

			}).catch(errorHandler)

		}).catch(errorHandler)

	}
)