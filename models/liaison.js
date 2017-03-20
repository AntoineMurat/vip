let db = require(__dirname+'/../dbPromiseWrapper')
let vipModel = require(__dirname+'/vip')

module.exports.findByVipId = id => new Promise(
	(resolve, reject) => {

		let liaisons

        let sql = `SELECT IF(VIP_VIP_NUMERO = ?, VIP_NUMERO,
		           VIP_VIP_NUMERO) as conjoint, DATE_EVENEMENT as date,
				   LIAISON_MOTIFFIN as motiffin
				   FROM liaison
				   WHERE VIP_NUMERO = ? OR VIP_VIP_NUMERO = ?;`

		db.query(sql, [id, id, id]).then(_liaisons => {

			liaisons = _liaisons

			return Promise.all(
				liaisons.map(liaison => vipModel.findById(liaison.conjoint))
			)

		}).then(_conjoints => {

			_conjoints.forEach((conjoint, index) => {
				liaisons[index].conjoint = conjoint
			})

			resolve(liaisons)

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération des liaisons de la Vip ${id}.`)

		})

	}
)