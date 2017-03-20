let db = require(__dirname+'/../dbPromiseWrapper')

module.exports.findById = id => new Promise(
	(resolve, reject) => {

		let sql = `SELECT EXEMPLAIRE_NUMERO as id,
        		   EXEMPLAIRE_DATEPUBLICATION as date
        		   FROM exemplaire
        		   WHERE EXEMPLAIRE_NUMERO = ?;`

	    db.query(sql, [id]).then(_exemplaire => {

	    	if (_exemplaire[0]){

	    		resolve(_exemplaire[0])

	    	} else {

	    		reject(`Exemplaire ${id} introuvable.`)

	    	}

	    }).catch(msg => {

	    	console.error(msg)
	        reject(`Erreur lors de la récupération de l'exemplaire ${id}.`)
	    
	    })

	}
)