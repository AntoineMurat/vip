let db = require(__dirname+'/../dbPromiseWrapper')
let filmModel = require(__dirname+'/film')

module.exports.findByVipId = id => new Promise(
	(resolve, reject) => {

		let errorHandler = msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération de la profession de réalisateur de la Vip ${id}.`)

		}

		let realisateur

		let sql = `SELECT VIP_NUMERO as id
				   FROM realisateur
				   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then(_realisateur => {

			if (_realisateur.length == 0){
				
				resolve(false)
				return 
			
			} 

			realisateur = _realisateur[0]

			filmModel.findByRealisateurId(id).then(_films => {

				realisateur.films = _films

				resolve(realisateur)

			}).catch(errorHandler)

		}).catch(errorHandler)

	}
)