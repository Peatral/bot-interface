import nc from "next-connect";
import auths from "@lib/middlewares/auth";
import passport from "passport";

export default nc({})
  .use(...auths)
  .get(passport.authenticate("discord"));
