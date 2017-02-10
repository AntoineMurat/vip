let db = require(__dirname+'/../dbPromiseWrapper')
let agenceModel = require(__dirname+'/agence')
let defileModel = require(__dirname+'/defile')

module.exports.findByVipId = (id) => new Promise(
	(resolve, reject) => {

		let errorHandler = (msg) => {

			console.log(msg)
			reject(`Erreur lors de la récupération de la profession de mannequin de la Vip ${id}.`)

		}

		let mannequin

		let sql = `SELECT MANNEQUIN_TAILLE as taille,
				   VIP_NUMERO as id
				   FROM mannequin
				   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then((_mannequin) => {

			if (_mannequin.length == 0){
				
				resolve(false)
				return
			
			} 

			mannequin = _mannequin[0]

			Promise.all([

				agenceModel.findByVipId(id),

				defileModel.findByMannequinId(id)

			]).then((results) => {

				mannequin.agences = results[0]
				mannequin.defiles = results[1]

				resolve(mannequin)

			}).catch(errorHandler)

		}).catch(errorHandler)

	}
)