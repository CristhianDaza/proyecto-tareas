const passport = require('passport')

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
