let db = require(__dirname+'/../dbPromiseWrapper')

module.exports.findByVipId = (id) => new Promise(
	(resolve, reject) => {

		let sql = `SELECT AGENCE_NOM as nom,
				   ag.AGENCE_NUMERO as id
				   FROM agence ag
				   JOIN apouragence ap ON ag.AGENCE_NUMERO = ap.AGENCE_NUMERO
				   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then((_agences) => {

			resolve(_agences)

		}).catch((msg) => {

			console.log(msg)
			reject(`Erreur lors de la récupération des agences de la Vip ${id}.`)

		})

	}
)