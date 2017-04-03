let db = require(__dirname+'/../dbPromiseWrapper')
let defileModel = require(__dirname+'/defile')

module.exports.insert = (couturier, defiles = array()) => new Promise(
	(resolve, reject) => {

		let sql = `INSERT INTO couturier SET ?;`

		db.query(sql, {
			VIP_NUMERO : couturier.vip
		}).then(res => {

			let tabDefiles = defiles.map(defile => defileModel.insert(defile))

			return Promise.all(tabDefiles)

		}).then(() => resolve(true)).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de l'insertion du conturier ${couturier.vip}.`)

		})
	}
)

module.exports.findByVipId = id => new Promise(
	(resolve, reject) => {

		let errorHandler = msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération de la profession de couturier de la Vip ${id}.`)

		}

		let couturier

		let sql = `SELECT VIP_NUMERO as id
				   FROM couturier
				   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then(_couturier => {

			if (_couturier.length == 0){
				
				resolve(false)
				return
			
			} 

			couturier = _couturier[0]

			defileModel.findByCouturierId(id).then(_defiles => {

				couturier.defiles = _defiles

				resolve(couturier)

			}).catch(errorHandler)

		}).catch(errorHandler)

	}
)

module.exports.removeByVip = vip => new Promise(
	(resolve, reject) => {

        let sql = `DELETE FROM defile WHERE VIP_NUMERO = ?;`

		db.query(sql, [vip]).then(res => {

			sql = `DELETE FROM couturier WHERE VIP_NUMERO = ?;`

			return db.query(sql, [vip])

		}).then(() => resolve(true)).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de la suppression du métier de couturier de ${vip}.`)

		})

	}
)