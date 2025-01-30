import { check, validationResult } from 'express-validator'
import User from '../models/user.js'
import { generateId } from '../helpers/tokens.js'
const loginForm = (req, res) => {
    res.render( 'auth/login', {
        page: 'Iniciar sesión'
    } )
}
const registerForm = (req, res) => {
    res.render( 'auth/register', {
        page: 'Crear una Cuenta'
    } )
}

const resetPasswordForm = (req, res) => {
    res.render( 'auth/reset_password', {
        page: '¿Olvidaste tu contraseña?'
    } )
}

const register = async (req, res) =>{
    const { username, email, password } = req.body;
    //check si los campos introducidos por el usuario son correctos y cumplen el formato
    await check('username').notEmpty().withMessage( 'El nombre no puede ir vacio' ).run( req )
    await check('email').isEmail().withMessage( 'El email introducido no es correcto' ).run( req )
    await check('password').isLength({ min: 6 }).withMessage( 'La contraseña debe tener al menos 6 caracteres' ).run( req )
    await check('confirm_password').equals(password).withMessage( 'Las contraseñas no coinciden' ).run( req )

    let result = validationResult( req )
    //datos del usuario



    if(!result.isEmpty()){
        return res.render( 'auth/register', {
            page: 'Crear una Cuenta',
            errors: result.array(),
            user: {
                username: username,
                email: email
            }
        } )

    }
    
    
    //verificar si el usuario ya existe en la base de datos
    const userExists = await User.findOne({ where:{ email } })
    if( userExists ){
        return res.render( 'auth/register', {
            page: 'Crear una Cuenta',
            errors: [ { msg: "El usuario ya está registrado" } ],
            user: {
                username: req.body.username,
                email: email
            }
        } )
    }
    console.log( userExists )
    const user = await User.create({
        username,
        email,
        password,
        token: generateId(),

    })
    
    //mostrar mensaje de confirmacion
    res.render( 'templates/msg', {
        page: 'Cuenta creada correctamente',
        message: 'Presiona en el enlace que hemos enviado en un email de confirmación.'
    } )
}

export {
    loginForm,
    registerForm,
    resetPasswordForm,
    register
}