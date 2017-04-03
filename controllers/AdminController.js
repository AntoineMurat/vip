let vipModel = require(__dirname+"/../models/vip")
let parametreModel = require(__dirname+"/../models/parametres")

module.exports.Index = (req, res) => {

	if (req.session.login){
		res.redirect('/vip/ajouter')
		return
	}

	res.render('login', res)

}

module.exports.Deconnexion = (req, res) => {

	if (req.session.login){
		delete req.session.login
	}

	res.redirect('/')

}

module.exports.Login = (req, res) => {

	parametreModel.checkLogins(req.body.login, req.body.password).then(logged => {

		if (logged){

			req.session.login = req.body.login

			res.redirect(`/`);

		} else {

			res.erreur = `Identifiants incorrects`
			res.render('login', res)

		}

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}