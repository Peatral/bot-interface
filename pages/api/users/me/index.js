import nc from "next-connect";
import {verifyUser} from "@utils/authenticate";
import {discordApiCall} from "@utils/discordapi";
import auths from "@lib/middlewares/auth";

export default nc({})
  .use(...auths)
  .use(verifyUser)
  .get(async (req, res, next) => {
    discordApiCall(req, res, "/users/@me");
  });
