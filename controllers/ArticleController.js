let articleModel = require(__dirname+"/../models/article")
let vipModel = require(__dirname+"/../models/vip")

module.exports.Racine = (req, res) => {

	res.title = "Articles de VIPs"

	vipModel.findWithArticle().then(vips => {

		res.vips = vips
    	res.render('articles', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}

module.exports.PourVIP = (req, res) => {

	Promise.all([

		vipModel.findWithArticle(),

		articleModel.findByVipId(req.params.id),

		vipModel.findById(req.params.id)
		
	]).then(results => {

		[res.vips, res.articles, res.vip] = results

		res.title = `Articles concernant ${res.vip.prenom} ${res.vip.nom}`

    	res.render('articles', res)

	}).catch(msg => {

		console.error(msg)
		return res.status(500).send(msg)

	})

}
