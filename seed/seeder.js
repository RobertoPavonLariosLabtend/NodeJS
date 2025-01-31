import { exit } from 'node:process'
import categories from "./categories.js";
import Category from "../models/Category.js";
import db from '../config/db.js'

const importData = async () => {
    try {
        //autenticar
        await db.authenticate()

        //generar tablas
        await db.sync({ force: true })
        console.log("Tablas sincronizadas correctamente");
        //insertar datos
        await Category.bulkCreate( categories )
        console.log("✅ Datos insertados correctamente.");
        exit(0)

        
    } catch (error) {
        console.log( error )
        exit(1)
    }
}

if( process.argv[2] == " -i" ){
    importData()
}