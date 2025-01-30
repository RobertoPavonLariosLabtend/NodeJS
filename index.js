import express from 'express'
import userRoutes from './routes/userRoutes.js'
import db from './config/db.js'
//crear aplicacion

const app = express()
app.use( express.json() )
//habilitar lecuta datos formularios
app.use( express.urlencoded({ extended: true }) );

//conexion base de datos

try{
    await db.authenticate()
    db.sync()
    console.log( 'conexion establecida con la BBDD' )
}catch ( error ){
    console.log( `error ${error}`)
}



app.use( '/', userRoutes )
app.use( '/auth', userRoutes )

//habilitar pug
app.set( 'view engine', 'pug' )
app.set( 'views', './views' )


//Carpeta publica

app.use( express.static( 'public' ) )

//definit puerto y arrancar proyecto

const port = 3000

app.listen( port, () =>{
    console.log( `El servidor esta esuchando por el puerto ${port}` )
} );