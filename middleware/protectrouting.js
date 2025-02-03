import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const protectRouting = async ( req, res, next ) => {
    console.log( 'mensaje del middleware' )

    const { _token } = req.cookies
    console.log( 'middleware' )
    //token es nulo
    if( !_token ) {
        return res.redirect( 'auth/login' )
    }
    //token valido?
    try{
        const decoded = jwt.verify( _token, process.env.JWT_SECRET_WRD )
        const user = await User.scope('deletePassword').findByPk( decoded.id )

        console.log( user )
        if( user ){
            req.user = user
        }else{
            return res.clearCookie( '_token' ).redirect( 'auth/login' )
        }

        return next()

    }catch( error ){
        return res.clearCookie( '_token' ).redirect( 'auth/login' )
    }


    
}

export default protectRouting 