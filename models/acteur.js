let db = require(__dirname+'/../dbPromiseWrapper')
let filmModel = require(__dirname+'/film')

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