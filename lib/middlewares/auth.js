import passport from "../passport";
import cookieParser from "cookie-parser";

const auths = [cookieParser(process.env.COOKIE_SECRET), passport.initialize()];

export default auths;
