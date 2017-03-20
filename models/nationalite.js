let db = require(__dirname+'/../dbPromiseWrapper')

module.exports.findById = id => new Promise(
	(resolve, reject) => {

		let sql = `SELECT NATIONALITE_NUMERO AS id, 
				   NATIONALITE_NOM as nom
        		   FROM nationalite
        		   WHERE NATIONALITE_NUMERO = ?;`

		db.query(sql, [id]).then(_nationalite => {

			if (_nationalite[0]){

				resolve(_nationalite[0])

			} else {

				reject(`Nationalité ${id} introuvable.`)

			}

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération de la nationalité ${id}.`)

		})

	}
)

module.exports.find = id => new Promise(
	(resolve, reject) => {

		let sql = `SELECT NATIONALITE_NUMERO AS id, 
				   NATIONALITE_NOM as nom
        		   FROM nationalite;`

		db.query(sql, [id]).then(_nationalites => {

			resolve(_nationalites)

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération de l'ensemble des nationalités.`)

		})

	}
)