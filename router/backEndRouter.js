let AdminController = require('./../controllers/AdminController')
let VipAdminController = require('./../controllers/VipAdminController')
let PhotoAdminController = require('./../controllers/PhotoAdminController')

// Routes
module.exports = (app) => {

	// Home
	app.get('/', AdminController.Index)
	app.get('/deconnexion', AdminController.Deconnexion)

	app.post('/', AdminController.Login)

	// VIPs
	app.get('/vip/ajouter', VipAdminController.Ajouter)
	app.get('/vip/modifier', VipAdminController.ModifierSelection)
	app.get('/vip/modifier/:id', VipAdminController.Modifier)
	app.get('/vip/supprimer', VipAdminController.Supprimer)

	app.post('/vip/ajouter', VipAdminController.AjouterPOST)
	app.post('/vip/modifier', VipAdminController.ModifierSelectionPOST)
	app.post('/vip/modifier/:id', VipAdminController.ModifierPOST)
	app.post('/vip/supprimer', VipAdminController.SupprimerPOST)

	// Photos

	app.get('/photo/ajouter', PhotoAdminController.Ajouter)
	app.get('/photo/supprimer', PhotoAdminController.Supprimer)

	app.post('/photo/ajouter', PhotoAdminController.AjouterPOST)
	app.post('/photo/supprimer', PhotoAdminController.SupprimerPOST)

	// Déchêts
	app.get('*', AdminController.Index)
	app.post('*', AdminController.Index)

}