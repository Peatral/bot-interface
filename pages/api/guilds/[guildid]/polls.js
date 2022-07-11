import nc from "next-connect";
import {
  respondWithInternalServerError,
  respondWithCreated,
  respondWithUnauthorized,
  respondWithNotFound,
  respondWithBadRequest,
} from "@utils/apiutil";
import Guild from "@models/guild";
import api_auths from "@lib/middlewares/api_auth";

export default nc({})
  .use(...api_auths)
  .get(async (req, res, next) => {
    const guildId = req.query.guildid;

    Guild.findById(guildId)
      .then((guild) => {
        if (!guild) {
          return respondWithNotFound(res, "Guild not found");
        }

        res.status(200).json({
          polls: guild.polls,
        });
      })
      .catch((err) => respondWithInternalServerError(res, err));
  });
