let db = require(__dirname+'/../dbPromiseWrapper')
let vipModel = require(__dirname+'/vip')

module.exports.findByVipId = (id) => new Promise(
	(resolve, reject) => {

		let mariages

		let sql = `SELECT IF(VIP_VIP_NUMERO = ?, VIP_NUMERO,
	               VIP_VIP_NUMERO) as conjoint, DATE_EVENEMENT as debut, 
				   MARIAGE_LIEU as lieu, MARIAGE_FIN as fin,
				   MARIAGE_MOTIFFIN as motiffin
				   FROM mariage
				   WHERE VIP_NUMERO = ? OR VIP_VIP_NUMERO = ?;`

		db.query(sql, [id, id, id]).then((_mariages) => {

			mariages = _mariages

			return Promise.all(
				mariages.map((mariage) => vipModel.findById(mariage.conjoint))
			)

		}).then((_conjoints) => {

			_conjoints.forEach((conjoint, index) => {
				mariages[index].conjoint = conjoint
			})

			resolve(mariages)

		}).catch((msg) => {

			console.log(msg)
			reject(`Erreur lors de la récupération des mariages de la Vip ${id}.`)

		})

	}
)