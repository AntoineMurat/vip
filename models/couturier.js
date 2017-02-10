let db = require(__dirname+'/../dbPromiseWrapper')
let defileModel = require(__dirname+'/defile')

module.exports.findByVipId = (id) => new Promise(
	(resolve, reject) => {

		let errorHandler = (msg) => {

			console.log(msg)
			reject(`Erreur lors de la récupération de la profession de couturier de la Vip ${id}.`)

		}

		let couturier

		let sql = `SELECT VIP_NUMERO as id
				   FROM couturier
				   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then((_couturier) => {

			if (_couturier.length == 0){
				
				resolve(false)
				return
			
			} 

			couturier = _couturier[0]

			defileModel.findByCouturierId(id).then((_defiles) => {

				couturier.defiles = _defiles

				resolve(couturier)

			}).catch(errorHandler)

		}).catch(errorHandler)

	}
)