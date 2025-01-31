import express from 'express'
import { loginForm, loginUser, registerForm, resetPasswordForm, register, confirmAccount, resetPassword, checkToken, newPassword } from '../controllers/userController.js';

const router = express.Router();

//Routing
router.route( '/login' )
    .get( loginForm )
    .post( loginUser )

router.route( '/register' )
    .get( registerForm )
    .post( register )

router.route( '/reset_password' )
    .get( resetPasswordForm )
    .post( resetPassword )

router.route( '/confirm_account/:token' )
    .get( confirmAccount )
    
router.route( '/reset_password/:token' )
    .get( checkToken )
    .post( newPassword )





export default router;