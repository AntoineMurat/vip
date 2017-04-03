let db = require(__dirname+'/../dbPromiseWrapper')

module.exports.findByVipId = id => new Promise(
	(resolve, reject) => {

		let sql = `SELECT PHOTO_ADRESSE as adresse,
        		   PHOTO_NUMERO as numero,
        		   PHOTO_SUJET as sujet,
        		   PHOTO_COMMENTAIRE as commentaire
        		   FROM photo
        		   WHERE VIP_NUMERO = ? 
        		   ORDER BY PHOTO_NUMERO;`

	    db.query(sql, [id]).then(_photos => {

	    	resolve(_photos)

	    }).catch(msg => {

	    	console.error(msg)
	        reject(`Erreur lors de la récupération des photos de la Vip ${id}.`)
	    
	    })

	}
)

module.exports.insert = photo => new Promise(
	(resolve, reject) => {

		// On insère en première position si on a pas de photo de profil.

		sql = `INSERT INTO photo SET ?`

		module.exports.findByVipId(photo.vip).then(photos =>

			db.query(sql,{

				PHOTO_NUMERO: (photos.length === 0 || photos[0].numero !== 1) ? 1 : (photos.length+1),
		    	PHOTO_ADRESSE: photo.adresse,
		    	PHOTO_SUJET: photo.sujet,
		    	PHOTO_COMMENTAIRE: photo.commentaire,
		    	VIP_NUMERO: photo.vip

		    })

		).then(res => {

	    	resolve(res.insertId)

	    }).catch(msg => {

	    	console.error(msg)
	        reject(`Erreur lors de la récupération des photos de la Vip ${id}.`)
	    
	    })

	}
)

module.exports.removeByVipById = (vip, id) => new Promise(
	(resolve, reject) => {

		let sql = `DELETE FROM photo WHERE VIP_NUMERO = ? AND PHOTO_NUMERO = ?;`

	    db.query(sql, [vip, id]).then(res => {

			if (res.affectedRows){

				resolve(true)

			} else {

				reject(`Photo ${id} introuvable.`)

			}

		}).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de la suppression de la photo ${id}.`)

		})
	}
)

module.exports.removeByVip = (vip) => new Promise(
	(resolve, reject) => {

		let sql = `DELETE FROM comporte WHERE PHOTO_NUMERO IN (SELECT PHOTO_NUMERO FROM photo WHERE VIP_NUMERO = ?);`

	    db.query(sql, [vip]).then(res => {

	    	sql = `DELETE FROM photo WHERE VIP_NUMERO = ?;`

	    	return db.query(sql, [vip])

		}).then(res => {

	    	resolve(true)

		}).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de la suppression des photos de ${vip}.`)

		})
	}
)

module.exports.findPhotoPrincipaleByVipId = id => new Promise(
	(resolve, reject) => {

		let sql = `SELECT PHOTO_ADRESSE as adresse,
        		   PHOTO_NUMERO as numero,
        		   PHOTO_SUJET as sujet,
        		   PHOTO_COMMENTAIRE as commentaire
        		   FROM photo
        		   WHERE VIP_NUMERO = ? AND PHOTO_NUMERO = 1;`;

	    db.query(sql, [id]).then(_photo => {

	    	if (_photo[0]) {

		    	resolve(_photo[0])

		    } else {

		    	reject(`Photo principale de la Vip ${id} introuvable.`)

		    }

	    }).catch(msg => {

	    	console.error(msg)
	        reject(`Erreur lors de la récupération de la photo principale de la Vip ${id}.`)
	    
	    })

	}
)

module.exports.findByArticleId = id => new Promise(
	(resolve, reject) => {

		let sql = `SELECT PHOTO_ADRESSE as adresse,
        		   p.PHOTO_NUMERO as numero,
        		   PHOTO_SUJET as sujet,
        		   PHOTO_COMMENTAIRE as commentaire
        		   FROM photo p
        		   JOIN comporte c ON c.PHOTO_NUMERO = p.PHOTO_NUMERO
        		   WHERE ARTICLE_NUMERO = ?;`;

	    db.query(sql, [id]).then(_photos => {

	    	resolve(_photos)

	    }).catch(msg => {

	    	console.error(msg)
	        reject(`Erreur lors de la récupération des photos de l'article ${id}.`)
	    
	    })

	}

)