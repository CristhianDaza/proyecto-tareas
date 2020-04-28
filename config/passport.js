const passport = require('passport')
const localStrategy = require('passport-local').Strategy

// Referncia al modelo donde se autentica
const Usuarios = require('../models/Usuarios')

// local strategy - Logimn com credenciales propias (Usuario y passport)
passport.use(
  new localStrategy(
    // Por default passport espera un usuario y password
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.find({
          where: { email }
        })
        // El usaurio existe, password incorrecto
        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: 'Password Incorrecto'
          })
        }
        // El email existe y el password coorecto
        return done(null, usuario)
      } catch (error) {
        // Ese usiario no existe
        return done(null, false, {
          message: 'La cuenta no existe'
        })
      }
    }
  )
)

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario)
})

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario)
})

// exportar
module.exports = passport
