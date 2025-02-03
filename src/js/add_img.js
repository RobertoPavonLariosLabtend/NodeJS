
import { Dropzone } from 'dropzone'

Dropzone.options.addImg = {
    dictDefaultMessage: 'Sube tus imágenes aquí',
    acceptedFiles: '.png, .jpg, .jpeg', 
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'No puedes subir más de una foto por propiedad',
    paramName: 'image1',
    init: function() {
        const dropzone = this
        const postImg = document.querySelector('#postImg')

        postImg.addEventListener( 'click', function(){
            dropzone.processQueue()
        })

        dropzone.on(  'queuecomplete', function(){
            if( dropzone.getActiveFiles().length == 0 ){
                window.location.href = '/my_properties'
            }
        })
    }
}