let db = require(__dirname+'/../dbPromiseWrapper')
let crypto = require('crypto')

module.exports.checkLogins = (login, password) => new Promise(
	(resolve, reject) => {

		let sql = `SELECT TRUE as logged
				   FROM parametres
				   WHERE LOGIN = ? AND PASSWD = ?;`

		let hash = crypto.createHash('sha256').update(password).digest('hex').toString()

		db.query(sql, [login, hash]).then(_logged => {

			resolve(_logged.length != 0)

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de la connexion de la ${login}.`)

		})

	}
)