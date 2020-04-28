const passport = require('passport')
const Usuarios = require('../models/Usuarios');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Los dos campos son obligatorios'
})

// Función para revisar si el usaurio esta logeado o no
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
}
