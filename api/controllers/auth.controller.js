import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Regular Email/Password Auth
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User not found"));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        const { password: hashedPassword, ...rest } = validUser._doc;

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json({ 
            success: true, 
            message: 'User created successfully!' 
        });
    } catch (error) {
        next(error);
    }
};

export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token')
           .status(200)
           .json('User signed out successfully');
    } catch (error) {
        next(error);
    }
};

// Google OAuth
export const google = async (req, res, next) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return next(errorHandler(400, 'Google credential is required'));
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { name, email, picture: photo } = payload;

    if (!email || !name) {
      return next(errorHandler(400, 'Google authentication failed - missing required data'));
    }

    const user = await User.findOne({ email });
    
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      const { password: pass, ...rest } = user._doc;
      
      return res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'none',
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        })
        .status(200)
        .json(rest);
    }

    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
    const username = name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4);
    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: photo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const { password: pass, ...rest } = newUser._doc;

    return res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      })
      .status(200)
      .json(rest);

  } catch (error) {
    console.error('Google auth error:', error);
    next(errorHandler(500, 'Google authentication failed'));
  }
};
