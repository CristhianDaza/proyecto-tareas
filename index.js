const express = require('express')
const routes = require('./routes')
const path = require('path')

const app = express()

app.set('view engine', 'pug')

app.set('views', path.join(__dirname, './views'))

app.use('/', routes())

app.listen(3000)
