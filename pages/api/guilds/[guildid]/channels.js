import nc from "next-connect";
import {
  respondWithInternalServerError,
  respondWithCreated,
  respondWithUnauthorized,
  respondWithNotFound,
  respondWithBadRequest,
} from "@utils/apiutil";
import {
  getToken,
  getRefreshToken,
  COOKIE_OPTIONS,
  verifyUser,
} from "@utils/authenticate";
import auths from "@lib/middlewares/auth";
import {useRouter} from "next/router";

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
  .use(...auths)
  .use(verifyUser)
  .get(async (req, res, next) => {
    const Router = useRouter();
    const guildId = Router.query.guildid;
    botApiCall(req, res, `/guilds/${guildId}/channels`);
  });
