let db = require(__dirname+'/../dbPromiseWrapper')
let vipModel = require(__dirname+'/vip')

module.exports.findByVipId = id => new Promise(
	(resolve, reject) => {

		let mariages

		let sql = `SELECT IF(VIP_VIP_NUMERO = ?, VIP_NUMERO,
	               VIP_VIP_NUMERO) as conjoint, DATE_EVENEMENT as debut, 
				   MARIAGE_LIEU as lieu, MARIAGE_FIN as fin,
				   MARIAGE_MOTIFFIN as motiffin
				   FROM mariage
				   WHERE VIP_NUMERO = ? OR VIP_VIP_NUMERO = ?;`

		db.query(sql, [id, id, id]).then(_mariages => {

			mariages = _mariages

			return Promise.all(
				mariages.map(mariage => vipModel.findById(mariage.conjoint))
			)

		}).then(_conjoints => {

			_conjoints.forEach((conjoint, index) => {
				mariages[index].conjoint = conjoint
			})

			resolve(mariages)

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération des mariages de la Vip ${id}.`)

		})

	}
)

module.exports.insert = mariage => new Promise(
	(resolve, reject) => {

        let sql = `INSERT INTO liaisons SET ?;`

		db.query(sql, {
			VIP_NUMERO : mariage.vip,
			VIP_VIP_NUMERO : mariage.conjoint,
			DATE_EVENEMENT : new Date(mariage.debut).toISOString().substr(0, 19).replace('T', ' '),
			MARIAGE_FIN : new Date(mariage.fin).toISOString().substr(0, 19).replace('T', ' '),
			MARIAGE_LIEU : mariage.lieu,
			LIAISON_MOTIFFIN : mariage.motiffin
		}).then(res => {

			resolve(res.insertId)

		}).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de l'insertion de la liaison entre ${liaison.vip} et ${liaison.conjoint}.`)

		})

	}
)