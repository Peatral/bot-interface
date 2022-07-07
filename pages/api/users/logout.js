import nc from "next-connect";
import dbConnect from "@utils/connectdb";
import DiscordUser from "@models/discorduser";
import {
  respondWithUnauthorized,
  respondWithInternalServerError,
} from "@utils/apiutil";
import {
  getToken,
  getRefreshToken,
  COOKIE_OPTIONS,
  verifyUser,
} from "@utils/authenticate";
import {serialize} from "cookie";
import auths from "@lib/middlewares/auth";

export default nc({})
  .use(...auths)
  .use(verifyUser)
  .get(async (req, res, next) => {
    const {signedCookies = {}} = req;
    const {refreshToken} = signedCookies;

    await dbConnect();

    DiscordUser.findById(req.user._id, (err, user) => {
      // user was already removed from the db
      if (err) {
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        return res.send({success: true});
      }

      const tokenIndex = user.refreshToken.findIndex(
        (item) => item.refreshToken === refreshToken,
      );

      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
      }

      user.save((err, user) => {
        if (err) {
          return respondWithInternalServerError(res, err);
        }

        //res.clearCookie("refreshToken", COOKIE_OPTIONS);
        res.setHeader(
          "Set-Cookie",
          "refreshToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
        );
        res.status(200).send({success: true});
      });
    });
  });
