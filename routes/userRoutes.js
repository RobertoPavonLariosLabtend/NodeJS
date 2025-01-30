import express from 'express'
import { loginForm, registerForm, resetPasswordForm, register, confirmAccount  } from '../controllers/userController.js';

const router = express.Router();

//Routing
router.route( '/login' )
    .get( loginForm )

router.route( '/register' )
    .get( registerForm )
    .post( register )

router.route( '/reset_password' )
    .get( resetPasswordForm )

router.route( '/confirm_account/:token' )
    .get( confirmAccount )




export default router;