import express from 'express'
import { body } from 'express-validator'
import { admin, createProperty, saveProperty, addImage, updatePropertyImg } from '../controllers/propertiesController.js'
import protectRouting from '../middleware/protectrouting.js'
const router = express.Router()

router.get('/my_properties', protectRouting, admin)

router.route( '/create' )
    .get( protectRouting, createProperty )
    .post( 
        body( 'title' ).notEmpty().withMessage( 'Debe añadir un titulo a la Propiedad' ),
        body( 'description' )
            .notEmpty().withMessage( 'La descripción no puede ir vacía' )
            .isLength( { max: 10 } ).withMessage( 'La descripción es demasiado larga' ),
        body( 'category' ).notEmpty().withMessage( 'Debe añadir una Categoría' ),
        body( 'price' ).notEmpty().withMessage( 'Debe añadir un Precio' ),
        body( 'rooms' ).notEmpty().withMessage( 'Debe añadir un número de Habitaciones' ),
        body( 'parking' ).notEmpty().withMessage( 'Debe añadir un número de Plazas de Parking' ),
        body( 'wc' ).notEmpty().withMessage( 'Debe añadir un número de cuartos de Baño' ),
        body( 'lat' ).notEmpty().withMessage( 'Debe añadir una ubicación en el mapa' ),
        protectRouting,
        saveProperty )

router.route( '/add_img/:id' )
        .get( protectRouting, addImage )
        .post( protectRouting, updatePropertyImg  )



export default router