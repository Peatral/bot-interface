import nc from "next-connect";
import {
  respondWithInternalServerError,
  respondWithCreated,
  respondWithUnauthorized,
  respondWithNotFound,
  respondWithBadRequest,
} from "@utils/apiutil";
import Guild from "@models/guild";
import dbConnect from "@utils/connectdb";

const checkToken = function (req, res, next) {
  if (req.query.token == process.env.API_MASTER_TOKEN) {
    next();
  } else {
    respondWithUnauthorized(res);
  }
};

export default nc({})
  .use(checkToken)
  .get(async (req, res, next) => {
    await dbConnect();

    const guildId = req.query.guildid;

    Guild.findById(guildId)
      .then((guild) => {
        if (guild) {
          return respondWithNotFound(res, "Guild not found");
        }

        res.status(200).json({
          admins: guild.admins,
        });
      })
      .catch((err) => respondWithInternalServerError(res, err));
  });
