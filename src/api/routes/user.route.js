import express from 'express'
import { authorize
 } from '../middlewares/authorize.js';
const router = express.Router();
import {signUp,login,logout} from '../controllers/userController.js'
router.post('/signup',signUp);
router.post('/login',login);
router.get('/logout',logout);

export default router