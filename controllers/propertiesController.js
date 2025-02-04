import { unlink } from 'node:fs/promises'
import { validationResult } from "express-validator"
import {Price, Category, Property } from '../models/index.js'

const admin = async (req, res) => {


    const { page: pageIndex } = req.query
    
    const regExp = /^[0-9]$/

    if(!regExp.test(pageIndex)){
        return res.redirect( '/my_properties?page=1' )
    }

    try {
        const {  id }  = req.user

        const limit = 1
        
        const offset = ((pageIndex * limit) - limit )
        
        const [ properties, propertyCount ] = await Promise.all([
            Property.findAll({
                limit,
                offset,
                where: {
                    userId: id
                },
                include: [
                    { model: Category, as: 'category' },
                    { model: Price, as: 'price' },
                ]
            }),
            Property.count({
                where:{
                    userID: id
                }
            })
        ])
        const pageNum = Math.ceil( propertyCount / limit )
        console.log(`pagina ${pageNum}` )
        res.render( 'properties/admin' ,{
            page: 'Mis propiedades',
            properties: properties,
            pageNum,
            pageIndex
        })
    
        
    } catch (error) {
        
    }

    

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

const editProperty = async (req, res) => {

    const [ categories, prices ] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    const { id } = req.params
    const userId = req.user.id

    console.log( id )
    console.log( userId )

    const property = await Property.findByPk(id, {
        include: [
            { model: Category, as: 'category' },
            { model: Price, as: 'price' }
        ]
    });

    if( !property ){
        return res.redirect( '/my_properties' )
    }

    if( property.userId.toString() != userId.toString() ){
        return res.redirect( '/my_properties' )
    }

    res.render( 'properties/edit' ,{
        page: 'Edita tu propiedad',
        showNav: true,
        categories,
        prices,
        data: property
    })
}

const saveEditProperty = async (req, res) => {

    let result = validationResult( req )

    if( !result.isEmpty() ){
        const [ categories, prices ] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])

        return res.render( 'properties/edit' ,{
            page: 'Crear una propiedad',
            showNav: true,
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })
    }
    const { id } = req.params
    const userId = req.user.id

    console.log( id )
    console.log( userId )

    const property = await Property.findByPk(id, {
        include: [
            { model: Category, as: 'category' },
            { model: Price, as: 'price' }
        ]
    });

    if( !property ){
        return res.redirect( '/my_properties' )
    }

    if( property.userId.toString() != userId.toString() ){
        return res.redirect( '/my_properties' )
    }

    //edit item

    try{
        const { title, description, category: categoryId, price: priceId, rooms, parking, wc, street, lat, lng } = req.body

        property.set({
            title,
            description,
            categoryId,
            priceId,
            rooms,
            parking,
            wc, 
            street,
            lat,
            lng
        })

        await property.save()
        return res.redirect( '/my_properties' )
    }catch( error ){
        return res.render( 'properties/edit' ,{
            page: 'Crear una propiedad',
            showNav: true,
            categories,
            prices,
            errors:['Error al editar la propiedad, inténtalo de nuevo más tarde'],
            data: req.body
        })
    }
}

const deleteProperty = async (req, res) => {
    const { id } = req.params
    //console.log(id)
    //verificar que la propiedad existe
    const property = await Property.findByPk(id)
    console.log( property )
    if(!property){
        console.log('mal')
        return res.redirect( '/my_properties' )
    }
    if( property.img ){
        await unlink(`public/uploads/${property.img}`)
    }

    await property.destroy()
    return res.redirect( '/my_properties' )
    
}

const showProperty = async ( req, res ) => {

    const { id } = req.params
    const property = await Property.findByPk(id, {
        include: [
            { model: Category, as: 'category' },
            { model: Price, as: 'price' }
        ]
    });
    res.render( 'properties/show', {
        property,
        page: property.title
    })
} 


export{
    admin,
    createProperty,
    saveProperty,
    addImage,
    updatePropertyImg,
    editProperty,
    saveEditProperty,
    deleteProperty,
    showProperty
}