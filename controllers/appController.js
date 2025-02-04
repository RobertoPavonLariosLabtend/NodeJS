import { where } from 'sequelize'
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
const category = (req, res) =>{

}
const notFound = (req, res) =>{

}
const search = (req, res) =>{

}

export {
    home,
    category,
    notFound,
    search
}