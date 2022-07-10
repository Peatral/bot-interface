import nc from "next-connect";
import {
  respondWithInternalServerError,
  respondWithCreated,
  respondWithUnauthorized,
  respondWithNotFound,
  respondWithBadRequest,
} from "@utils/apiutil";
import {Poll, PollEntry} from "@models/poll";
import {checkDBConnection} from "@utils/dbutils";

const checkToken = function (req, res, next) {
  if (req.query.token == process.env.API_MASTER_TOKEN) {
    next();
  } else {
    respondWithUnauthorized(res);
  }
};

export default nc({})
  .use(checkDBConnection)
  .get(async (req, res, next) => {
    const authorId = req.query.authorId;
    const guildId = req.query.guildId;
    const messageId = req.query.messageId;
    const status = req.query.status;

    const filter = {};
    if (authorId) {
      filter.authorId = authorId;
    }
    if (guildId) {
      filter.guildId = guildId;
    }
    if (messageId) {
      filter.messageId = messageId;
    }
    if (
      status &&
      (status === "SCHEDULED" || status === "OPEN" || status === "CLOSED")
    ) {
      filter.status = status;
    }

    Poll.find(filter)
      .then((polls) => {
        res.status(200).json({
          polls: polls,
        });
      })
      .catch((err) => respondWithInternalServerError(res, err));
  });
