let db = require(__dirname+'/../dbPromiseWrapper')
let vipModel = require(__dirname+'/vip')

module.exports.findByRealisateurId = id => new Promise(
	(resolve, reject) => {

		let sql = `SELECT FILM_NUMERO as id,
				   VIP_NUMERO as realisateur,
				   FILM_TITRE as titre,
				   FILM_DATEREALISATION as date
				   FROM film
				   WHERE VIP_NUMERO = ?;`

		db.query(sql, [id]).then(_films => {

			resolve(_films)

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération des films du réalisateur ${id}.`)

		})

	}
)

module.exports.findByActeurId = id => new Promise(
	(resolve, reject) => {

		let films

		let sql = `SELECT f.FILM_NUMERO as id,
				   f.VIP_NUMERO as realisateur,
				   FILM_TITRE as titre,
				   FILM_DATEREALISATION as date
				   FROM film f
				   JOIN joue j ON f.FILM_NUMERO = j.FILM_NUMERO
				   WHERE j.VIP_NUMERO = ?;`

		db.query(sql, [id]).then(_films => {

			films = _films

			return Promise.all(
				films.map(film => vipModel.findById(film.realisateur))
			)

		}).then(_realisateurs => {

			_realisateurs.forEach((realisateur, index) => {

				films[index].realisateur = realisateur

			})

			resolve(films)

		}).catch(msg => {

			console.error(msg)
			reject(`Erreur lors de la récupération des défilés de l'acteur ${id}.`)

		})

	}
)