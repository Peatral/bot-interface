import nc from "next-connect";
import {
  respondWithInternalServerError,
  respondWithCreated,
  respondWithUnauthorized,
  respondWithNotFound,
  respondWithBadRequest,
} from "@utils/apiutil";
import {Poll} from "@models/poll";
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

    Poll.findById(pollId)
      .then((poll) => {
        if (!poll) {
          return respondWithNotFound(res, "Poll not found");
        }

        if (poll.status !== "OPEN") {
          return respondWithBadRequest(res, [
            "Poll has to be open to be closed",
          ]);
        }

        (poll.status = "CLOSED"), (poll.endTimestamp = Date.now());

        poll
          .save()
          .then((poll) => res.status(200).json(poll))
          .catch((err) => respondWithInternalServerError(res, err));
      })
      .catch((err) => respondWithInternalServerError(res, err));
  });
