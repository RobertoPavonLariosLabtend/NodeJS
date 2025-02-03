import { exit } from 'node:process'
import categories from "./categories.js";
import prices from "./prices.js";
import users from "./users.js";
import { Price, Category, User } from "../models/index.js"
import db from '../config/db.js'

const importData = async () => {
    try {
        //autenticar
        await db.authenticate()

        //generar tablas
        await db.sync({ force: true })
        console.log("Tablas sincronizadas correctamente");
        //insertar datos

        await Promise.all([
            Category.bulkCreate( categories ),
            Price.bulkCreate( prices ),
            User.bulkCreate( users ),
        ])

        console.log("✅ Datos insertados correctamente.");
        exit(0)

        
    } catch (error) {
        console.log( error )
        exit(1)
    }
}

const dropDBData = async () => {
    try{
        await db.sync({ force: true })
        exit(0)
    }catch( error ){
        console.log( error )
        exit(1)
    }
}

if( process.argv[2] === "-i" ){
    importData()
}
if( process.argv[2] === "-e" ){
    dropDBData()
}