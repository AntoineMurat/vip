let db = require(__dirname+'/../dbPromiseWrapper')

module.exports.findById = (id) => new Promise(
	(resolve, reject) => {

		let sql = `SELECT EXEMPLAIRE_NUMERO as id,
        		   EXEMPLAIRE_DATEPUBLICATION as date
        		   FROM exemplaire
        		   WHERE EXEMPLAIRE_NUMERO = ?;`

	    db.query(sql, [id]).then((_exemplaire) => {

	    	resolve(_exemplaire[0])

	    }).catch((msg) => {

	    	console.log(err)
	        reject(`Erreur lors de la récupération de l'exemplaire ${id}.`)
	    
	    })

	}
)