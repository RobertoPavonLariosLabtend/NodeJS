import express from 'express'
import { loginForm, registerForm, resetPasswordForm, register  } from '../controllers/userController.js';

const router = express.Router();

//Routing
router.route( '/login' )
    .get( loginForm )

router.route( '/register' )
    .get( registerForm )
    .post( register )

router.route( '/reset_password' )
    .get( resetPasswordForm )




export default router;