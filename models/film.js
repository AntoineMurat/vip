let db = require(__dirname+'/../dbPromiseWrapper')
let vipModel = require(__dirname+'/vip')

module.exports.insertActeur = (joue) => new Promise(
	(resolve, reject) => {

		let sql = `INSERT INTO joue SET ?;`

		db.query(sql, {
			FILM_TITRE : joue.idFilm, 
			ROLE_NOM : joue.role_nom, 
			VIP_NUMERO : joue.acteur
		}).then(res => {

			resolve(res.insertId)

		}).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de l'insertion de l'acteur dans le film ${joue.id}.`)

		})
	}
)

module.exports.insert = (film) => new Promise(
	(resolve, reject) => {

		let sql = `INSERT INTO film SET ?;`

		db.query(sql, {
			FILM_TITRE : film.titre, 
			FILM_DATEREALISATION : film.date, 
			VIP_NUMERO : film.realisateur
		}).then(res => {

			resolve(res.insertId)

		}).catch(msg => {

			console.error(msg)
    		reject(`Erreur lors de l'insertion du film ${film.id}.`)

		})
	}
)

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