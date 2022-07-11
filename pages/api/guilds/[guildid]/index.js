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

    let guild = new Guild({
      _id: guildId,
      polls: [],
      admins: [],
    });

    guild
      .save()
      .then(() => respondWithCreated(res, `/guilds/${guildId}`))
      .catch((err) => {
        if (err.code == 11000) {
          respondWithInternalServerError(res, "Guild already exists");
          return;
        }
        respondWithInternalServerError(res, err);
      });
  })
  .delete(async (req, res, next) => {
    const guildId = req.query.guildid;

    Guild.findOneAndRemove({
      _id: guildId,
    })
      .then((guild) => {
        if (!guild) {
          return respondWithNotFound(res, "Guild not found");
        }

        res.status(200).send("OK");
      })
      .catch((err) => respondWithInternalServerError(res, err));
  })
  .get(async (req, res, next) => {
    const guildId = req.query.guildid;

    Guild.findById(guildId)
      .then((guild) => {
        if (!guild) {
          return respondWithNotFound(res, "Guild not found");
        }

        res.status(200).json({
          id: guild._id,
          admins: guild.admins,
          polls: guild.polls,
        });
      })
      .catch((err) => respondWithInternalServerError(res, err));
  });
