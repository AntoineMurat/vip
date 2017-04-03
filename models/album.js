let db = require(__dirname+'/../dbPromiseWrapper')
let maisondisqueModel = require(__dirname+'/maisondisque')

module.exports.insert = album => new Promise(
	(resolve, reject) => {

		let sql = `INSERT INTO album SET ?;`
		let albumNumero = Math.floor(Math.random()*1000000)

		db.query(sql, {
			MAISONDISQUE_NUMERO : album.maisondisque,
			ALBUM_NUMERO: albumNumero,
			ALBUM_TITRE : album.titre,
			ALBUM_DATE : album.date

		}).then(res => {

			sql = `INSERT INTO composer SET ?;`
			
			return db.query(sql, {
				VIP_NUMERO : album.vip,
				ALBUM_NUMERO : albumNumero
			})

		}).then(() => resolve(true)).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de l'insertion de l'album ${album}.`)

		})
	}
)

module.exports.findByVipId = id => new Promise(
	(resolve, reject) => {

		let albums

		let sql = `SELECT ALBUM_TITRE as titre,
				   a.ALBUM_NUMERO as id,
				   ALBUM_DATE as date,
				   MAISONDISQUE_NUMERO as maisondisque
				   FROM album a
				   JOIN composer c ON c.ALBUM_NUMERO = a.ALBUM_NUMERO
				   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then(_albums => {

			albums = _albums

			return Promise.all(
				albums.map(album => maisondisqueModel.findById(album.maisondisque))
			)

		}).then(_maisondisques => {

			_maisondisques.forEach((maisondisque, index) => {

				albums[index].maisondisque = maisondisque

			})

			resolve(albums)

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération des albums de la Vip ${id}.`)

		})

	}
)