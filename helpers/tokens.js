import jwt from 'jsonwebtoken'

const generateId = () => Date.now().toString( 32 ) + Math.random().toString( 32 ).substring(2)


const generateJWT = data => 
    jwt.sign({
        id: data.id,
        username: data.username
    }, process.env.
        JWT_SECRET_WRD, {
        expiresIn: '1d'
    })


export {
    generateId,
    generateJWT
}