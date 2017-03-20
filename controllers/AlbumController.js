let vipModel = require(__dirname+"/../models/vip")

module.exports.ListerAlbum = (req, res) => {

	let defaultPromise = (toReturn) => new Promise(
		(resolve, reject) => {resolve(toReturn)}
	)

	req.params.id = req.params.id || -1
	req.params.photo = req.params.photo || 1
	req.params.page = req.params.page || 1

	// On récupère en parallèle le vip chargé et la liste des vips

	Promise.all([

		(req.params.id == -1) ? 
			defaultPromise(false) : 
			vipModel.findById(req.params.id).then(vip => {

				return vipModel.loadAttributes(vip, new Set(["photos"]))

			})
		,

		vipModel.find().then(vips => {

			res.last = parseInt(vips.length/12 + 1)

			vips = vips.filter(vip => {

				let indexVip = vips.indexOf(vip) +1

				return (indexVip > (req.params.page-1)*12) && (indexVip <= (req.params.page*12))

			})

			return Promise.all(
				vips.map( vip => vipModel.loadAttributes(vip, new Set(["photo"])) )
			)

		})

	]).then(results => {

		[res.vip, res.vips] = results

		if (res.vip){

			res.photo = res.vip.photos.filter(photo => photo.numero == req.params.photo)[0]
			
			res.title = `Album de ${res.vip.prenom} ${res.vip.nom}.`
		
		} else {
		
			res.title = "Albums des stars."

		}

		res.page = req.params.page

		res.render('albums', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}