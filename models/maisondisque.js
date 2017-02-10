let db = require(__dirname+'/../dbPromiseWrapper')

module.exports.findById = (id) => new Promise(
	(resolve, reject) => {

		let sql = `SELECT MAISONDISQUE_NOM as nom,
				   MAISONDISQUE_NUMERO as id
				   FROM maisondisque md
				   WHERE MAISONDISQUE_NUMERO = ?;`

		db.query(sql, [id]).then((_maisondisque) => {

			resolve(_maisondisque[0])

		}).catch((msg) => {

			console.log(msg)
			reject(`Erreur lors de la récupération de la maison de disque ${id}.`)

		})

	}
)