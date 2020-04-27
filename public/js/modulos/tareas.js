import axios from "axios"
import Swal from 'sweetalert2'

import { actualizarAvance } from '../funciones/avance'

const tareas = document.querySelector('.listado-pendientes')

if(tareas) {
  tareas.addEventListener('click', e => {
    if (e.target.classList.contains('fa-check-circle')) {
      const icono = e.target
      const idTarea = icono.parentElement.parentElement.dataset.tarea
      const url = `${location.origin}/tareas/${idTarea}`
      axios.patch(url, { idTarea })
        .then(function(res) {
          if(res.status === 200) {
            icono.classList.toggle('completo')
            actualizarAvance()
          }
        })
    }

    if (e.target.classList.contains('fa-trash')) {
      const tareaHTML = e.target.parentElement.parentElement
      const idTarea = tareaHTML.dataset.tarea
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Una vez eliminado no se podra recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '!Si, eliminar!',
        cancelButtonText: 'No, cancelar'
        }).then((result) => {
          if (result.value) {
            const url = `${location.origin}/tareas/${idTarea}`
            axios.delete(url, { params: { idTarea } })
              .then(function(res) {
                if (res.status === 200) {
                  tareaHTML.parentElement.removeChild(tareaHTML)

                  Swal.fire(
                    'Tarea Eliminada',
                    res.data,
                    'success'
                  )

                  actualizarAvance()
                }
              })
          }
        })
      }
    })
}

export default tareas
