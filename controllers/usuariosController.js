const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email')

exports.formCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    nombrePagina: 'Crear cuenta'
  })
}

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes
  res.render('iniciarSesion', {
    nombrePagina: 'Inicia Sesión',
    error
  })
}

exports.crearCuenta = async (req, res) => {
  const { email, password } = req.body

  try {
    await Usuarios.create({
      email,
      password
    })
    // crear una URL de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`
    // crear objeto de usuario
    const usuario = {
      email
    }
    //enviar email
    await enviarEmail.enviar({
      usuario,
      subject: 'Confirma tu cuenta',
      confirmarUrl,
      archivo: 'confirmar-cuenta'
    })
    // redirigir al usuario
    req.flash('correcto', 'Enviamos un correo, confirma tu cuenta')
    res.redirect('/iniciar-sesion')
  } catch (error) {
    req.flash('error', error.errors.map(error => error.message))
    res.render('crearCuenta', {
      mensajes: req.flash(),
      nombrePagina: 'Crear cuenta',
      email,
      password
    })
  }
}

exports.formRestablecerPassword = (req, res) => {
  res.render('reestablecer', {
    nombrePagina: 'Reestablecer tu Contraseña'
  })
}

exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo
    }
  })

  if (!usuario) {
    req.flash('error', 'No valido')
    res.redirect('/crear-cuenta')
  }

  usuario.activo = 1
  await usuario.save()

  req.flash('correcto', 'Cuenta activada correctamente')
  res.redirect('/iniciar-sesion')
}
