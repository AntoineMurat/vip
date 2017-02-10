let db = require(__dirname+'/../dbPromiseWrapper')
let exemplaireModel = require(__dirname+"/exemplaire")

module.exports.findByVipId = (id) => new Promise(
	(resolve, reject) => {

		let articles

		let sql = `SELECT a.ARTICLE_NUMERO as id,
        		   ARTICLE_TITRE as titre,
        		   EXEMPLAIRE_NUMERO as exemplaire,
        		   ARTICLE_NUMEROPAGEDEBUT as page,
        		   ARTICLE_RESUME as resume,
        		   ARTICLE_DATE_INSERT as date
        		   FROM article a
        		   JOIN apoursujet aps ON aps.ARTICLE_NUMERO = a.ARTICLE_NUMERO
        		   WHERE VIP_NUMERO = ?;`

	    db.query(sql, [id]).then((_articles) => {

	    	articles = _articles

	    	return Promise.all(
	    		articles.map((article) => exemplaireModel.findById(article.exemplaire))
	    	)

	    }).then((_exemplaires) => {

	    	_exemplaires.forEach((exemplaire, index) => {

	    		articles[index].exemplaire = exemplaire

	    	})

	    	resolve(articles)

	    }).catch((msg) => {

	    	console.log(err)
	        reject(`Erreur lors de la récupération des articles de la Vip ${id}.`)
	    
	    })

	}
)