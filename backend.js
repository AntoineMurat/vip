var express         = require('express'),
    session         = require('express-session'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'), //pour récupérer les résultats des post
    http            = require('http'),
    path            = require('path'),
    fileUpload      = require('express-fileupload')

var app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload())

app.set('port', 6801)
app.set('views', path.join(__dirname, 'views'))

app.set('view options', { layout: 'admin' })

// routes static, le routeur n'y aura pas accès
app.use(express.static(path.join(__dirname, '/public')))

app.use(cookieParser())

app.use(session({
    secret: 'nC0@#1pM/-0qA1+é',
    name: 'VipNode',
    resave: true,
    saveUninitialized: true
}))

/* ces lignes permettent d'utiliser directement les variables de session dans handlebars
 UTILISATION : {{session.MaVariable}}  */

app.use(function(req, res, next){
    res.locals.session = req.session
    res.layout = 'admin'
    if (req.session.login || req.url == '/')
        next()
    else 
        res.redirect("/")
})

var exphbs = require('express-handlebars')
app.set('view engine', 'handlebars') //nom de l'extension des fichiers
var handlebars  = require(__dirname+'/helpers/handlebars.js')(exphbs) //emplacement des helpers
// helpers : extensions d'handlebars
//handlebars.registerPartial('photosMenu', 'partials/photosMenu')
//handlebars.registerPartial('vipsManue', 'partials/vipsMenu')

app.engine('handlebars', handlebars.engine)


// chargement du routeur
require(__dirname+'/router/backEndRouter')(app)


http.createServer(app).listen(app.get('port'), function(){
    console.log('Serveur Node.js de backend en attente sur le port ' + app.get('port'))
})