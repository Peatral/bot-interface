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
  .put(async (req, res, next) => {
    const guildId = req.query.guildid;
    const userId = req.query.userid;

    Guild.findByIdAndUpdate(guildId, {
      $addToSet: {
        admins: userId,
      },
    })
      .then((guild) => {
        if (!guild) {
          return respondWithNotFound(res, "Guild not found");
        }
        respondWithCreated(res, `/guilds/${guildId}/admins/${userId}`);
      })
      .catch((err) => respondWithInternalServerError(res, err));
  })
  .delete(async (req, res, next) => {
    const guildId = req.query.guildid;
    const userId = req.query.userid;

    Guild.findByIdAndUpdate(guildId, {
      $pull: {
        admins: userId,
      },
    })
      .then((guild) => {
        if (!guild) {
          return respondWithNotFound(res, "Guild not found");
        }
        res.status(200).send("OK");
      })
      .catch((err) => respondWithInternalServerError(res, err));
  });
