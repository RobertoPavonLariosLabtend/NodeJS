import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateId, generateJWT } from '../helpers/tokens.js'
import { sendEmailRegister, sendEmailPasswordReset  } from '../helpers/emails.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



const loginForm = (req, res) => {
    res.render( 'auth/login', {
        page: 'Iniciar sesión'
    } )
}

const loginUser = async (req, res) => {
    await check('email').isEmail().withMessage( 'El email introducido no es correcto' ).run( req )
    await check('password').isLength({ min: 6 }).withMessage( 'La contraseña debe tener al menos 6 caracteres' ).run( req )
    let result = validationResult( req )

    const { email, password } = req.body
    //comprobar si los cambios son validos
    if(!result.isEmpty()){
        return res.render( 'auth/login', {
            page: 'Iniciar sesión',
            errors: result.array(),
            user: {
                email: email
            }
        } )
    }

    //comprobar si el usuario existe
    const user = await User.findOne({ where: {email} })
    if(!user){
        return res.render( 'auth/login', {
            page: 'Iniciar sesión',
            errors: [ { msg: 'El correo que ha introducido no le pertenece a ningún usuario' } ]
        } )
    }
    //comprobar si el usuario verifico su cuenta
    if( !user.isConfirmed ){
        return res.render( 'auth/login', {
            page: 'Iniciar sesión',
            errors: [ { msg: 'Error: Debe verificar su cuenta' } ],
            user: {
                email: email
            }
        } )
    }

    //comprobar si el usuario introdujo la contraseña correctamente
    if( !user.checkPassword( password ) ){
        return res.render( 'auth/login', {
            page: 'Iniciar sesión',
            errors: [ { msg: 'La contraseña que ha introducida es incorrecta' } ],
            user: {
                email: email
            }
        } )
    }

    const token = generateJWT( { id: user.id, username: user.username })

    return res.cookie('_token', token, {
        httpOlny: true,
        secure: true
    }).redirect('/my_properties')

}
const registerForm = (req, res) => {
    res.render( 'auth/register', {
        page: 'Crear una Cuenta',
        //csrfToken: req.csrfToken()
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
            //csrfToken: req.csrfToken(),
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
            //scsrfToken: req.csrfToken(),
            errors: [ { msg: "El usuario ya está registrado" } ],
            user: {
                username: req.body.username,
                email: email
            }
        } )
    }

    const user = await User.create({
        username,
        email,
        password,
        token: generateId(),

    })

    sendEmailRegister({
        username: user.username,
        email: user.email,
        token: user.token
    })
    
    //mostrar mensaje de confirmacion
    res.render( 'templates/msg', {
        page: 'Cuenta creada correctamente',
        message: 'Presiona en el enlace que hemos enviado en un email de confirmación.'
    } )
}

const confirmAccount = async(req, res, next) => {

    const { token } = req.params
    //console.log( token )

    //verificar si el token es valido
    const user = await User.findOne({
        where: {token}
    })

    if( !user ){
        return res.render( 'auth/confirm_account', {
            page: 'Error al Confirmar Cuenta',
            message: 'Hubo un error, intentalo de nuevo mas tarde',
            error: true
        })
    }

    //confirmar la cuenta
    user.isConfirmed = true
    await user.save()
    return res.render( 'auth/confirm_account', {
        page: 'Cuenta Confirmada',
        message: 'Has confirmado tu cuenta, ¡bienvenido!',
        error: false
    })

    console.log( user )




}

const resetPassword =async  (req, res) =>{

    await check('email').isEmail().withMessage( 'El email introducido no es correcto' ).run( req )
    
    let result = validationResult( req )

    if(!result.isEmpty()){
        return res.render( 'auth/reset_password', {
            page: 'Recupera el acceso tu cuenta de Bienes Raices',
            errors: result.array()
        } )

    }
    
    //Buscar si el usuario existe

    const { email } = req.body

    const user = await User.findOne({ where: {email} })

    if(!user){
        return res.render( 'auth/reset_password', {
            page: 'Recupera el acceso tu cuenta de Bienes Raices',
            errors: [ {msg: 'El correo introducido no pertenece a ningún usuario'} ]
        } )
    }

    //Generar un token
    user.token = generateId()
    await user.save()

    //Enviar email
    sendEmailPasswordReset({
        email,
        username: user.username,
        token: user.token
    })

    //mostrar mensaje
    return res.render( 'templates/msg', {
        page: 'Recupera el acceso tu cuenta de Bienes Raices',
        message: `Hemos enviado un correo a ${email}, compruebe su bandeja de entrada.`
    } )

}


const checkToken = async (req, res) => {
    const { token } = req.params
    const user = await User.findOne({ where: {token} })

    if(!user){
        return res.render( 'auth/reset_password', {
            page: 'Recupera el acceso tu cuenta de Bienes Raices',
            errors: [ {msg: 'Hubo un error al validar su información, inténtelo de nuevo.'} ],
            error: true
        } )
    }

    return res.render( 'auth/new_password', {
        page: 'Recupera el acceso tu cuenta de Bienes Raices',
    } )
}
const newPassword = async (req, res) => {
    
    
    //validar nueva contrasela
    await check('password').isLength({ min: 6 }).withMessage( 'La contraseña debe tener al menos 6 caracteres' ).run( req )
    
    let result = validationResult( req )
    if(!result.isEmpty){
        //console.log( 'hola' )
        return res.render( 'auth/new_password', {
            page: 'Recupera el acceso tu cuenta de Bienes Raices',
            errors: result.array()
        } )
    }

    const { token } = req.params
    const { password } = req.body

    const user = await User.findOne({ where: {token} })
    
    //Identificar la nueva contraseña
    const salt = await bcrypt.genSalt( 10 )
    user.password = await bcrypt.hash( password, salt )
    user.token = null
    
    await user.save()

    return res.render( 'auth/confirm_account', {
        page: 'Contrasaeña reestablecida',
        message: 'No te olivdes de ella otra vez anda'
    })

}

export {
    loginForm,
    loginUser,
    registerForm,
    resetPasswordForm,
    confirmAccount,
    resetPassword,
    checkToken,
    newPassword,
    register
}