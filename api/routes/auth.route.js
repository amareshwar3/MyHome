import express from 'express';
import { 
    signin, 
    signup, 
    signout,
    google 
} from '../controllers/auth.controller.js';

const router = express.Router();

// Regular email/password auth
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);

// Google OAuth
router.post('/google', google);

export default router;
