const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')

exports.agregarTarea = async (req, res, next) => {
  const proyecto = await Proyectos.findOne({ where: { url: req.params.url } })
  const { tarea } = req.body
  const estado = 0
  const proyectoId = proyecto.id

  const resultado = await Tareas.create({ tarea, estado, proyectoId } )

  if(!resultado) {
    return next()
  }

  res.redirect(`/proyectos/${req.params.url}`)
}
