const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    nombrePagina: 'Crear cuenta'
  })
}

exports.crearCuenta = (req, res) => {
  const { email, password } = req.body

  Usuarios.create({
    email,
    password
  })
  .then(() => {
    res.redirect('/iniciar-sesion')
  })
}
