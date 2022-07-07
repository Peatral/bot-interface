import DiscordUser from "@models/discorduser";
import fetch from "node-fetch";
import dbConnect from "@utils/connectdb";

const {DISCORD_API_VERSION} = process.env;

const {
  respondWithInternalServerError,
  respondWithUnauthorized,
} = require("./apiutil");

export async function discordApiCall(req, res, path) {
  if (!req.user) {
    respondWithUnauthorized(res);
    return;
  }
  await discordApiCallDirect(req.user._id, path, (err, json) => {
    if (err) {
      return res.status(err.status).json(err);
    }
    return res.json(json);
  });
}

export async function discordApiCallDirect(id, path, cb) {
  await dbConnect();

  if (!id) {
    return cb(
      {
        status: 401,
        error: "Unauthorized",
        message: "You are not authorized to access this resource",
      },
      null,
    );
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 5000);

  DiscordUser.findById(id).then((user, err) => {
    fetch(`https://discord.com/api/v${DISCORD_API_VERSION}${path}`, {
      headers: {
        authorization: `Bearer ${user.discordSession.accessToken}`,
      },
      signal: abortController.signal,
    })
      .then((discordRes) => {
        clearTimeout(timeoutId);
        return discordRes.json();
      })
      .then((json) => {
        return cb(null, json);
      })
      .catch((err) =>
        cb(
          {
            status: 500,
            error: "Internal Server Error",
            message: err,
          },
          null,
        ),
      );
  });
}

export default {discordApiCall, discordApiCallDirect};
