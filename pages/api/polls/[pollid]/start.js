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
  .post(async (req, res, next) => {
    const pollId = req.query.pollid;
    const messageId = req.body.messageId;

    if (!messageId) {
      return respondWithBadRequest(res, [
        "A message ID is needed to start this poll",
      ]);
    }

    Poll.findById(pollId)
      .then((poll) => {
        if (!poll) {
          return respondWithNotFound(res, "Poll not found");
        }

        if (poll.status !== "SCHEDULED") {
          return respondWithBadRequest(res, [
            "Poll has to be scheduled to be started",
          ]);
        }

        poll.status = "OPEN";
        poll.startTimestamp = Date.now();
        poll.messageId = messageId;

        poll
          .save()
          .then((poll) => res.status(200).json(poll))
          .catch((err) => respondWithInternalServerError(res, err));
      })
      .catch((err) => respondWithInternalServerError(res, err));
  });
