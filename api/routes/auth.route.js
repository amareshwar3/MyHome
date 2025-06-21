import express from 'express';
import passport from 'passport';
import { signin, signup, signout } from '../controllers/auth.controller.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Regular email/password auth (keep existing)
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);

// Google OAuth Routes (updated)
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // Forces account selection every time
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/sign-in?error=google_auth_failed`,
    session: false 
  }),
  (req, res) => {
    try {
      // Create JWT token
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

      // Set cookie and redirect
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/'
      });

      // Successful redirect
      res.redirect(`${process.env.CLIENT_URL}?google_auth=success`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/sign-in?error=server_error`);
    }
  }
);

// Keep this for mobile/API clients if needed
router.post('/google', async (req, res, next) => {
  passport.authenticate('google-token', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ success: false, message: 'Google authentication failed' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ success: true, user });
  })(req, res, next);
});

export default router;
