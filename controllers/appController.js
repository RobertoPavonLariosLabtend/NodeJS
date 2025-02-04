import { Sequelize, where } from 'sequelize'
import {Price, Category, Property } from '../models/index.js'

const home = async (req, res) =>{
    
    const [ categories, prices, houses, apartaments ] = await Promise.all([
        Category.findAll(),
        Price.findAll(),
        Property.findAll({
            where: {
                categoryId: 1
            },
            include: [
                {
                    model: Price, as: 'price'
                }
            ]
        }),
        Property.findAll({
            where: {
                categoryId: 2
            },
            include: [
                {
                    model: Price, as: 'price'
                }
            ]
        }),
    ])

    res.render('home', {
        categories,
        prices,
        houses,
        apartaments
    })

}
const category = async (req, res) => {
    const  { id } = req.params
    
    const category = await Category.findByPk( id )
    if(!category) {
        return res.redirect('/404')
    }

    //obtener propiedades de la categoria
    const properties = await Property.findAll({
        where: {
            categoryId: id
        },
        include: [
            { model: Price, as: 'price' }
        ]
    })
    
    res.render( 'category',  {
        page: `${category.name}s en venta`,
        properties
    })
}
const notFound =  (req, res) =>{
    res.render( '/templates/404', {
        page: '404: NOT FOUND'
    })
}
const search = async (req, res) =>{

    const { searchTerm } = req.body
    
    if(!searchTerm.trim()){
        return res.redirect('back')
    }

    const properties = await Property.findAll({
        where: {
            title: {
                [Sequelize.Op.like] : '%' + searchTerm + '%'
            }
        },
        include: [
            { model: Price, as: 'price' }
        ]
    })
    res.render( 'search',  {
        page: 'Resultados de la busqueda',
        properties
    })
}

export {
    home,
    category,
    notFound,
    search
}