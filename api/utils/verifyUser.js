import { errorHandler } from "./error.js"
import jwt from "jsonwebtoken"

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) return next(errorHandler(401, 'Authentication required'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Invalid or expired token'));
    req.user = user;
    next();
  });
};
