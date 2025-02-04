import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const identifyUser = async  (req, res, next) => {
    const token = req.cookies._token
    if(!token){
       req.user = null
       return next()   
    }

    try{
        const decoded = jwt.verify( token, process.env.JWT_SECRET_WRD )
        const user = await User.scope('deletePassword').findByPk(decoded.id )
        if( user ){
            req.user = user
        }
        return next()
    }catch(error){
        console.log( error )
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default identifyUser