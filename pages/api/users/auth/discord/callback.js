import nc from "next-connect";
import passport from "passport";
import auths from "@lib/middlewares/auth";
import dbConnect from "@utils/connectdb";
import DiscordUser from "@models/discorduser";
import {serialize} from "cookie";

import {getToken, getRefreshToken, COOKIE_OPTIONS} from "@utils/authenticate";

import {basePath} from "next.config";

export default nc({})
  .use(...auths)
  .get(
    passport.authenticate("discord", {
      failureRedirect: `${basePath}`,
    }),
  )
  .get(async (req, res, next) => {
    const token = getToken({_id: req.user._id});
    const refreshToken = getRefreshToken({_id: req.user._id});

    await dbConnect();

    DiscordUser.findByIdAndUpdate(req.user._id, {
      $push: {
        refreshToken: {refreshToken},
      },
    })
      .then((user, err) => {
        if (err) {
          respondWithInternalServerError(res, err);
        } else {
          //res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
          res.setHeader(
            "Set-Cookie",
            serialize("refreshToken", refreshToken, COOKIE_OPTIONS),
          );
          res.redirect(`${basePath}/logincallback?token=${token}`);
        }
      })
      .catch((err) => {
        res.redirect(`${basePath}`);
      });
  });
