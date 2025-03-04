import express from 'express'
import { body } from 'express-validator'
import { admin, createProperty, saveProperty, addImage, updatePropertyImg, editProperty, saveEditProperty, deleteProperty, showProperty, sendMessage, showMessages } from '../controllers/propertiesController.js'
import protectRouting from '../middleware/protectrouting.js'
import upload from '../middleware/uploadFile.js'
import identifyUser from '../middleware/identifyUser.js'

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
        .post(
            protectRouting,
            upload.single('image1'),
            updatePropertyImg  
        )

router.route( '/edit/:id' )
        .get( 
            protectRouting,
            editProperty
        )
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
            saveEditProperty
        )

router.post( '/delete/:id', protectRouting, deleteProperty )

//area publica

router.route( '/property/:id' )
    .get(  identifyUser, showProperty )
        .post( 
            identifyUser,
            body('message').isLength({min:10}).withMessage( 'El mensaje no puede ir vacio' ),
            sendMessage
        )

    
router.route( '/messages/:id')
    .get(
        identifyUser,
        showMessages
    )


export default router