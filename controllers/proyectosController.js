const Proyectos = require('../models/Proyectos');

exports.proyectosHome = async (req, res) => {
  const proyectos = await Proyectos.findAll()
  res.render('index', {
    nombrePagina: 'Proyectos',
    proyectos
  })
}

exports.formularioProyecto = (req, res) => {
  res.render('nuevoProyecto', {
    nombrePagina: 'Nuevo Proyecto'
  })
}

exports.nuevoProyecto = async (req, res) => {
  const { nombre } = req.body
  let errores = []
  if(!nombre) {
    errores.push({'texto': 'Agrega un Nombre al Proyecto'})
  }
  if(errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      errores
    })
  } else {
    const proyecto = await Proyectos.create({ nombre })
    res.redirect('/')
  }
}
