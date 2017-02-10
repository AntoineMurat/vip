let HomeController = require('./../controllers/HomeController')
let VipController = require('./../controllers/VipController')
let AlbumController = require('./../controllers/AlbumController')

// Routes
module.exports = (app) => {

	// Home
	app.get('/', HomeController.Index)

	// VIP
	app.get('/repertoire', VipController.Repertoire)
	app.get('/repertoire/:lettre', VipController.CommencantParLettre)
	app.get('/vip/:id', VipController.DetailsPourVip)

	// Albums
	app.get('/album', AlbumController.ListerAlbum)

	// Déchêts
	app.get('*', HomeController.Index)
	app.post('*', HomeController.Index)

}