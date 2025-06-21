import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

// Serialization/Deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
  passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Extract profile information
    const { id, displayName, emails, photos } = profile;
    const email = emails[0].value;
    const photo = photos[0]?.value || '';

    // 1. Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // 2a. If user exists and signed up with Google
      if (user.googleId) {
        return done(null, user);
      }
      // 2b. If user exists but signed up normally
      user.googleId = id;
      user.avatar = photo;
      await user.save();
      return done(null, user);
    }

    // 3. Create new user if doesn't exist
    const generatedPassword = bcryptjs.hashSync(
      Math.random().toString(36).slice(-8), 10
    );
    
    const username = displayName.replace(/\s+/g, '').toLowerCase() + 
      Math.random().toString(36).slice(-4);

    user = new User({
      username,
      email,
      password: generatedPassword,
      avatar: photo,
      googleId: id
    });

    await user.save();
    done(null, user);

  } catch (err) {
    done(errorHandler(500, 'Google authentication failed'), null);
  }
}));

// JWT Strategy (for regular auth)
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies.access_token;
      }
      return token;
    }
  ]),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));

export default passport;