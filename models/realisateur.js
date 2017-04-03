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

module.exports.insert = (realisateur, films = array()) => new Promise(
	(resolve, reject) => {

		let sql = `INSERT INTO realisateur SET ?;`

		db.query(sql, {
			VIP_NUMERO : realisateur.id
		}).then(res => {

			let tabFilms = films.map(film => filmModel.insert(film))

			return Promise.all(tabFilms)

		}).then(() => resolve(true)).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de l'insertion du réalisateur ${realisateur.id}.`)

		})
	}
)

module.exports.removeByVip = vip => new Promise(
	(resolve, reject) => {

        let sql = `DELETE FROM film WHERE VIP_NUMERO = ?;`

		db.query(sql, [vip]).then(res => {

			sql = `DELETE FROM realisateur WHERE VIP_NUMERO = ?;`

			return db.query(sql, [vip])

		}).then(() => resolve(true)).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de la suppression du métier de réalisateur de ${vip}.`)

		})

	}
)