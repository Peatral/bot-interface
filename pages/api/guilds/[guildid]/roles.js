import nc from "next-connect";
import {
  respondWithInternalServerError,
  respondWithCreated,
  respondWithUnauthorized,
  respondWithNotFound,
  respondWithBadRequest,
} from "@utils/apiutil";

import api_auths from "@lib/middlewares/api_auth";

const {BOT_API_URL} = process.env;

const botApiCall = async (req, res, path) => {
  fetch(`${BOT_API_URL}${path}`)
    .then((res) => res.json())
    .then((json) => {
      res.json(json);
    })
    .catch((err) => {
      respondWithInternalServerError(res, err);
    });
};

export default nc({})
  .use(...api_auths)
  .get(async (req, res, next) => {
    const guildId = req.query.guildid;
    botApiCall(req, res, `/guilds/${guildId}/roles`);
  });
