import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const User = db.define( 'users',{
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: DataTypes.STRING,
    isConfirmed: DataTypes.BOOLEAN
},{
    hooks: {
        beforeCreate: ( async function( user ){
            const salt = await bcrypt.genSalt( 10 )
            user.password = await bcrypt.hash( user.password, salt )
        } )
    },
    scopes: {
        deletePassword: {
            attributes: {
                exclude: ['password', 'token', 'isConfirmed', 'createdAt', 'updatedAt' ]
            }
        }
    }
} )

User.prototype.checkPassword = function( password ){
    return bcrypt.compareSync( password, this.password )
}


export default User;
