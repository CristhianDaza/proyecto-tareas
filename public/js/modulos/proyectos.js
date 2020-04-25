import Swal from 'sweetalert2'
import axios from 'axios'

const btnEliminar = document.querySelector('#eliminar-proyecto')

if(btnEliminar) {
  btnEliminar.addEventListener('click', e => {

    const urlProyecto = e.target.dataset.proyectoUrl

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
        const url = `${location.origin}/proyectos/${urlProyecto}`

        axios.delete(url, { params: { urlProyecto }})
          .then(function(respuesta){
            Swal.fire(
              '!Eliminado!',
              'El proyecto ha sido eliminado',
              'success'
            )

            setTimeout(() => {
              window.location.href = '/'
            }, 1000);
          })
          .catch(() => {
            Swal.fire({
              type: 'error',
              title: 'Hubo un error',
              text: 'No se pudo eliminar el proyecto'
            })
          })
      }
    })
  })
}

export default btnEliminar
