import express from 'express'
import { admin, createProperty } from '../controllers/propertiesController.js'
const router = express.Router()

router.get('/my_properties', admin)

router.route( '/create' )
    .get( createProperty )



export default router