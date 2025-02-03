import bcrypt from 'bcrypt'

const users = [
    {
        username: 'Roberto',
        email: 'roberto@gmail.com',
        isConfirmed: 1,
        password: bcrypt.hashSync( 'password', 10 )

    }
]

export default users;