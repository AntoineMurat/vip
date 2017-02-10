let db = require(__dirname+'/../dbPromiseWrapper')

module.exports.findByVipId = (id) => new Promise(
	(resolve, reject) => {

		let sql = `SELECT PHOTO_ADRESSE as adresse,
        		   PHOTO_NUMERO as numero,
        		   PHOTO_SUJET as sujet,
        		   PHOTO_COMMENTAIRE as commentaire
        		   FROM photo
        		   WHERE VIP_NUMERO = ? 
        		   ORDER BY PHOTO_NUMERO;`

	    db.query(sql, [id]).then((_photos) => {

	    	resolve(_photos)

	    }).catch((msg) => {

	    	console.log(err)
	        reject(`Erreur lors de la récupération des photos de la Vip ${id}.`)
	    
	    })

	}
)

module.exports.findPhotoPrincipaleByVipId = (id) => new Promise(
	(resolve, reject) => {

		let sql = `SELECT PHOTO_ADRESSE as adresse,
        		   PHOTO_NUMERO as numero,
        		   PHOTO_SUJET as sujet,
        		   PHOTO_COMMENTAIRE as commentaire
        		   FROM photo
        		   WHERE VIP_NUMERO = ? AND PHOTO_NUMERO = 1;`;

	    db.query(sql, [id]).then((_photo) => {

	    	resolve(_photo[0])

	    }).catch((msg) => {

	    	console.log(err)
	        reject(`Erreur lors de la récupération de la photo principale de la Vip ${id}.`)
	    
	    })

	}
)

module.exports.findByArticleId = (id) => new Promise(
	(resolve, reject) => {

		let sql = `SELECT PHOTO_ADRESSE as adresse,
        		   p.PHOTO_NUMERO as numero,
        		   PHOTO_SUJET as sujet,
        		   PHOTO_COMMENTAIRE as commentaire
        		   FROM photo p
        		   JOIN comporte c ON c.PHOTO_NUMERO = p.PHOTO_NUMERO
        		   WHERE ARTICLE_NUMERO = ?;`;

	    db.query(sql, [id]).then((_photos) => {

	    	resolve(_photos)

	    }).catch((msg) => {

	    	console.log(err)
	        reject(`Erreur lors de la récupération des photos de l'article ${id}.`)
	    
	    })

	}

)