let db = require(__dirname+'/../dbPromiseWrapper')
let vipModel = require(__dirname+'/vip')

module.exports.insert = defile => new Promise(
	(resolve, reject) => {
		db.query(`INSERT INTO defile SET ?;`, {
			DEFILE_NUMERO: Math.floor(Math.random()*10000),
			DEFILE_LIEU: defile.lieu,
			DEFILE_DATE: new Date(defile.date).toISOString().substr(0, 19).replace('T', ' '),
			VIP_NUMERO: defile.vip

		}).then(()=>{resolve(true)}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de l'insertion du défilé ${defile}.`)

		})
	}
)

module.exports.insertParticipant = participant => new Promise(
	(resolve, reject) => {
		db.query(`INSERT INTO defiledans SET ?;`, {

			DEFILE_NUMERO: participant.defile,
			VIP_NUMERO: participant.vip

		}).then(()=>{resolve(true)}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de l'insertion de la participation au defile ${participant}.`)

		})
	}
)

module.exports.find = () => new Promise(
	(resolve, reject) => {

		let sql = `SELECT DEFILE_NUMERO as id,
				   DEFILE_LIEU as lieu,
				   DEFILE_DATE as date
				   FROM defile;`

		db.query(sql).then(_defiles => {

			resolve(_defiles)

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération des défilés.`)

		})

	}
)

module.exports.findByCouturierId = id => new Promise(
	(resolve, reject) => {

		let sql = `SELECT DEFILE_NUMERO as id,
				   DEFILE_LIEU as lieu,
				   DEFILE_DATE as date
				   FROM defile
				   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then(_defiles => {

			resolve(_defiles)

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération des défilés du couturier ${id}.`)

		})

	}
)

module.exports.findByMannequinId = id => new Promise(
	(resolve, reject) => {

		let defiles

		let sql = `SELECT d.DEFILE_NUMERO as id,
				   DEFILE_LIEU as lieu,
				   DEFILE_DATE as date,
				   d.VIP_NUMERO as couturier
				   FROM defile d
				   JOIN defiledans dd ON dd.DEFILE_NUMERO = d.DEFILE_NUMERO
				   WHERE dd.VIP_NUMERO = ?;`

		db.query(sql, [id]).then(_defiles => {

			defiles = _defiles

			return Promise.all(
				defiles.map(defile => vipModel.findById(defile.couturier))
			)

		}).then(_couturiers => {

			_couturiers.forEach((couturier, index) => {

				defiles[index].couturier = couturier

			})

			resolve(defiles)

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération des défilés du mannequin ${id}.`)

		})

	}
)