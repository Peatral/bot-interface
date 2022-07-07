import nc from "next-connect";
import dbConnect from "@utils/connectdb";
import DiscordUser from "@models/discorduser";
import {
  respondWithUnauthorized,
  respondWithInternalServerError,
} from "@utils/apiutil";
import {getToken, getRefreshToken, COOKIE_OPTIONS} from "@utils/authenticate";
import {serialize} from "cookie";
const jwt = require("jsonwebtoken");

export default nc({}).post(async (req, res, next) => {
  const {signedCookies = {}, cookies = {}} = req;
  var {refreshToken} = signedCookies;

  if (!refreshToken) {
    refreshToken = cookies.refreshToken;
  }

  if (!refreshToken) {
    console.log("no refresh token");
    return respondWithUnauthorized(res);
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = payload._id;

    await dbConnect();

    DiscordUser.findById(userId).then(
      (user, err) => {
        if (!user) {
          console.log("user not in db");
          return respondWithUnauthorized(res);
        }

        // Find the refresh token against the user record in database
        const tokenIndex = user.refreshToken.findIndex(
          (item) => item.refreshToken === refreshToken,
        );

        if (tokenIndex === -1) {
          console.log("refresh token not in db");
          return respondWithUnauthorized(res);
        }

        const token = getToken({_id: userId});
        // If the refresh token exists, then create new one and replace it.
        const newRefreshToken = getRefreshToken({_id: userId});
        user.refreshToken[tokenIndex] = {refreshToken: newRefreshToken};
        user.save((err, newUser) => {
          if (err) {
            return respondWithInternalServerError(res, err);
          }

          //res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
          res.setHeader(
            "Set-Cookie",
            serialize("refreshToken", newRefreshToken, COOKIE_OPTIONS),
          );
          return res.status(200).send({success: true, token});
        });
      },
      (err) => next(err),
    );
  } catch (err) {
    return respondWithUnauthorized(res);
  }
});
