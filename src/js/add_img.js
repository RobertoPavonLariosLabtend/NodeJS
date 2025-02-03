import { Dropzone } from 'dropzone'

Dropzone.options.addImg = {
    dictDefaultMessage: 'Sube tus imágenes aquí',
    acceptedFiles: '.png, .jpg, .jpeg', 
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'No puedes subir más de una foto por propiedad'
}