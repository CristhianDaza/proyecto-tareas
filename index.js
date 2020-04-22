const express = require('express')
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

app.use(express.static('public'))

app.set('view engine', 'pug')

app.set('views', path.join(__dirname, './views'))

app.use(bodyParser.urlencoded({extended: true}))

app.use('/', routes())

app.listen(3000)
