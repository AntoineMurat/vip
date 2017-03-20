let HomeController = require('./../controllers/HomeController')
let VipController = require('./../controllers/VipController')
let AlbumController = require('./../controllers/AlbumController')
let ArticleController = require('./../controllers/ArticleController')

// Routes
module.exports = (app) => {

	// Home
	app.get('/', HomeController.Index)

	// VIPs
	app.get('/repertoire', VipController.Repertoire)
	app.get('/repertoire/:lettre', VipController.CommencantParLettre)
	app.get('/vip/:id', VipController.DetailsPourVip)
	app.get('/api/vip/:id', VipController.JSONPreview)

	// Articles

	app.get('/articles/', ArticleController.Racine)
	app.get('/articles/:id', ArticleController.PourVIP)

	// Albums
	app.get('/album/:id?/:photo?/:page?', AlbumController.ListerAlbum)

	// Déchêts
	app.get('*', HomeController.Index)
	app.post('*', HomeController.Index)

}