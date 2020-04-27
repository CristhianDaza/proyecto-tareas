const express = require('express')
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const helpers = require('./helpers')
const flash = require('connect-flash')

const db = require('./config/db')

require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')

db.sync()
  .then(() => console.log('Conectado al servidor'))
  .catch(error => console.log(error))

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.use(expressValidator())

app.use(express.static('public'))

app.set('view engine', 'pug')

app.set('views', path.join(__dirname, './views'))

app.use(flash())

app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump
  next()
})

app.use('/', routes())

app.listen(3000)
