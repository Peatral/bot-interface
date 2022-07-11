import passport from "passport";
import jwt from "jsonwebtoken";
import {
  respondWithUnauthorized,
  respondWithInternalServerError,
} from "./apiutil";

const dev = process.env.NODE_ENV !== "production";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  // Since localhost is not having https protocol, secure cookies does not work correctly (in postman)
  secure: !dev,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  sameSite: "strict",
  path: "/",
};

export function getToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: eval(process.env.SESSION_EXPIRY),
  });
}

export function getRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
  });
  return refreshToken;
}

export function verifyUser(req, res, next) {
  passport.authenticate("jwt", {session: false}, (err, user, info) => {
    if (err) {
      console.error(err);
      return respondWithInternalServerError(res, err);
    }
    if (!user) {
      return respondWithUnauthorized(res);
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      next();
    });
  })(req, res, next);
}
