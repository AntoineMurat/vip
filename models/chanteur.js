let db = require(__dirname+'/../dbPromiseWrapper')
let albumModel = require(__dirname+'/album')

module.exports.insert = (chanteur, albums = array()) => new Promise(
	(resolve, reject) => {

		let sql = `INSERT INTO chanteur SET ?;`

		db.query(sql, {
			VIP_NUMERO : chanteur.id
		}).then(res => {

			let tabAlbums = albums.map(album => albumModel.insert(album))

			return Promise.All(tabAlbums)

		}).then(() => resolve(true)).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de l'insertion du réalisateur ${realisateur.id}.`)

		})
	}
)

module.exports.findByVipId = id => new Promise(
	(resolve, reject) => {

		let errorHandler = msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération de la profession de chanteur de la Vip ${id}.`)

		}

		let chanteur

		let sql = `SELECT CHANTEUR_SPECIALITE as specialite,
				   VIP_NUMERO as id
				   FROM chanteur
				   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then(_chanteur => {

			if (_chanteur.length == 0){
				
				resolve(false)
				return
			
			} 

			chanteur = _chanteur[0]

			albumModel.findByVipId(id).then(_albums => {

				chanteur.albums = _albums

				resolve(chanteur)

			}).catch(errorHandler)

		}).catch(errorHandler)	

	}
)