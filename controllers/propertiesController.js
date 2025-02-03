import { validationResult } from "express-validator"
import {Price, Category, Property } from '../models/index.js'

const admin = async (req, res) => {

    const {  id }  = req.user

    const properties = await  Property.findAll({
        where: {
            userId: id
        },
        include: [
            { model: Category, as: 'category' },
            { model: Price, as: 'price' },
        ]
    })

    res.render( 'properties/admin' ,{
        page: 'Mis propiedades',
        properties: properties
    })
}
const createProperty = async (req, res) => {

    //get datos de precio y categorias de bbdd

    const [ categories, prices ] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render( 'properties/create' ,{
        page: 'Crear una propiedad',
        showNav: true,
        categories,
        prices,
        data: {}
    })
}

const saveProperty = async (req, res) => {

    let result = validationResult( req )

    if( !result.isEmpty() ){
        const [ categories, prices ] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])

        return res.render( 'properties/create' ,{
            page: 'Crear una propiedad',
            showNav: true,
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })
    }

    //si pasa la validacion crear un registro de propiedad
    const { title, description, category: categoryId, price: priceId, rooms, parking, wc, street, lat, lng } = req.body

    const price = Price.findAll({ where: { id: priceId } })
    const category = Category.findAll({ where: { id: categoryId } })

    const { id: userId } = req.user

    const newProperty = await Property.create({
        title,
        description,
        categoryId,
        priceId,
        rooms,
        parking,
        wc,
        street,
        lat,
        lng,
        userId,
        img: ''
    })

    const { id } = newProperty
    res.redirect( `add_img/${id}` )

}

const addImage = async( req, res ) => {

    const { id } = req.params
    //console.log(id)
    //verificar que la propiedad existe
    const property = await Property.findByPk(id)
    console.log( property )
    if(!property){
        console.log('mal')
        return res.redirect( '/my_properties' )
    }
    


    return res.render( 'properties/add_img', {
        page: 'Sube una imagen',
        property
    })
}


const updatePropertyImg = async ( req, res, next ) => {
    const { id } = req.params

    const property = await Property.findByPk(id)
    
    if(!property){
        return res.redirect( '/my_properties' )
    }

    if(property.isPublished){
        return res.redirect( '/my_properties' )
    }
    if( req.user.id.toString() !== property.userId.toString() ){
        return res.redirect( '/my_properties' )
    }
    try{
        console.log(req.file)
        property.img = req.file.filename
        property.isPublished  = 1
        await property.save()
    }catch( error ){
        console.log( error )
    }
    next()
}

export{
    admin,
    createProperty,
    saveProperty,
    addImage,
    updatePropertyImg
}