import express from 'express'
import userRoutes from './routes/userRoutes.js'
import propertiesRoutes from './routes/propertiesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'
import cookieParser from 'cookie-parser'
//crear aplicacion

const app = express()
app.use( express.json() )

//habilitar lecuta datos formularios
app.use( express.urlencoded({ extended: true }) );


//habilitar cookie parser
app.use( cookieParser() )

//habilitar csrf
//app.use( csrf({ cookie: true }) )

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
app.use( '/', propertiesRoutes )
app.use( '/', appRoutes )
app.use( '/', apiRoutes )

//habilitar pug
app.set( 'view engine', 'pug' )
app.set( 'views', './views' )


//Carpeta publicars

app.use( express.static( 'public' ) )

//definit puerto y arrancar proyecto

const port = process.env.PORT || 3000

app.listen( port, () =>{
    console.log( `El servidor esta esuchando por el puerto ${port}` )
} );