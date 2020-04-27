const Sequelize = require('sequelize');
const db = require('../config/db')
const Proyectos = require('../models/Proyectos')
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Agrega un Correo Válido'
      },
      notEmpty: {
        msg: 'El Correo no puede ir vacio'
      }
    },
    unique: {
      args: true,
      msg: 'Correo ya está registrado'
    }
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La Contraseña no puede ir vacia'
      }
    }
  }
}, {
  hooks: {
    beforeCreate(usuario) {
     usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
    }
  }
})

Usuarios.hasMany(Proyectos)

module.exports = Usuarios
