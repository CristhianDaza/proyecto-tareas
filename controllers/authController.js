const passport = require('passport')
const Usuarios = require('../models/Usuarios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Los dos campos son obligatorios'
})

// Función para revisar si el usuario esta logeado o no
exports.usuarioAutenticado = (req, res, next) => {
  // Si esl usuario esta autenticado, adelante
  if(req.isAuthenticated()) {
    return next()
  }
  // sino esta autenticado, redirigir al formulario
  return res.redirect('/iniciar-sesion')
}

// Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion') // al cerrar sesion nos lleva al login
  })
}

// Generar un token si el usuario es valido
exports.enviarToken = async (req, res) => {
  // Verificar que el usuario exista
  const { email } = req.body
  const usuario = await Usuarios.findOne({ where: { email } })

  // Si no exite el usuario
  if (!usuario) {
    req.flash('error', 'No exite esa cuenta')
    res.redirect('/reestablecer')
  }

  // usuario existe
  usuario.token = crypto.randomBytes(20).toString('hex')
  usuario.expiracion = Date.now() + 3600000

  // guardarlos en la base de datos
  await usuario.save()

  // url de rest
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`

  // Envia el correo con el Token
  await enviarEmail.enviar({
    usuario,
    subject: 'Password Reset',
    resetUrl,
    archivo: 'restablecer-password'
  })

  // Terminar la ejecucion
  req.flash('correcto', 'Se envió un mensaje a tu correo')
  res.redirect('/iniciar-sesion')
}

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token
    }
  })

  // Sino encuentra el usuario
  if (!usuario) {
    req.flash('error', 'No Válido')
    res.redirect('/reestablecer')
  }

  // Formulario para generar el passowrd
  res.render('resetPassword', {
    nombrePagina: 'Reestablecer Contraseña'
  })
}

// Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {

  // Verifica el token valido y la fecha de expiracion
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte]: Date.now()
      }
    }
  })

  // Verificamos si el usuario existe
  if (!usuario) {
    req.flash('error', 'No Válido')
    res.redirect('/reestablecer')
  }

  //hashear el nuevo password
  usuario.token = null
  usuario.expiracion = null
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))

  // guardamos el nuevo password
  await usuario.save()
  req.flash('correcto', 'Tu password se ha modificado correctamente')
  res.redirect('/iniciar-sesion')
}
