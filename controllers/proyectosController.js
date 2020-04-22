const Proyectos = require('../models/Proyectos');

exports.proyectosHome = async (req, res) => {
  const proyectos = await Proyectos.findAll()
  res.render('index', {
    nombrePagina: 'Proyectos',
    proyectos
  })
}

exports.formularioProyecto = async (req, res) => {
  const proyectos = await Proyectos.findAll()
  res.render('nuevoProyecto', {
    nombrePagina: 'Nuevo Proyecto',
    proyectos
  })
}

exports.nuevoProyecto = async (req, res) => {
  const proyectos = await Proyectos.findAll()
  const { nombre } = req.body
  let errores = []
  if(!nombre) {
    errores.push({'texto': 'Agrega un Nombre al Proyecto'})
  }
  if(errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      proyectos,
      errores
    })
  } else {
    const proyecto = await Proyectos.create({ nombre })
    res.redirect('/')
  }
}

exports.proyectoPorUrl = async (req, res) => {
  const proyectosPomise = Proyectos.findAll()
  const proyectoPomise = Proyectos.findOne({
    where: {
      url: req.params.url
    }
  })

  const [proyectos, proyecto] = await Promise.all([proyectosPomise, proyectoPomise])

  if (!proyecto) return next()

  res.render('tareas', {
    nombrePagina: 'Tareas del Proyecto',
    proyectos,
    proyecto
  })
}

exports.formularioEditar = async (req, res) => {
  const proyectosPomise = Proyectos.findAll()
  const proyectoPomise = Proyectos.findOne({
    where: {
      id: req.params.id
    }
  })

  const [proyectos, proyecto] = await Promise.all([proyectosPomise, proyectoPomise])

  res.render('nuevoProyecto', {
    nombrePagina: 'Editar Proyecto',
    proyectos,
    proyecto
  })
}
