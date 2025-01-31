import nodemailer from 'nodemailer'

const sendEmailRegister = async ( data ) => {

    const transport = nodemailer.createTransport( {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }

    })
    //console.log( data )
    const { username, email, token } = data

    await transport.sendMail({
        from: "BienesRaices.com",
        to: email,
        subject: 'Verifica tu cuenta de BienesRaices.com',
        text: 'Confirma tu cuenta',
        html: `

            <p>Hola ${username}, comprueba tu cuenta en BienesRaices.com</p>

            <p>Tu cuenta ya esta listam solo debes confirmarla en el siguiente enlace:
            <a href="${ process.env.BACKEND_URL }:${ process.env.PORT ?? 3000 }/auth/confirm_account/${token}">Confirmar Cuenta</a></p>
        `
    })
}

const sendEmailPasswordReset = async ( data ) => {

    const transport = nodemailer.createTransport( {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }

    })
    //console.log( data )
    const { username, email, token } = data

    await transport.sendMail({
        from: "BienesRaices.com",
        to: email,
        subject: 'Reestablece tu contraseña de BienesRaices.com',
        text: 'Confirma tu cuenta',
        html: `

            <p>Hola ${username}, hemos recibido una solicitud para cambiar su contraseña en BienesRaices.com</p>

            <p>Para ello haz click sobre el siguiente enlace:
            <a href="${ process.env.BACKEND_URL }:${ process.env.PORT ?? 3000 }/auth/reset_password/${token}">Resetear Contraseña.</a></p>
        `
    })
}


export {
    sendEmailRegister,
    sendEmailPasswordReset
}