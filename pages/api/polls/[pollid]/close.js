import nc from "next-connect";
import {
  respondWithInternalServerError,
  respondWithCreated,
  respondWithUnauthorized,
  respondWithNotFound,
  respondWithBadRequest,
} from "@utils/apiutil";
import Poll from "@models/poll";
import api_auths from "@lib/middlewares/api_auth";

export default nc({})
  .use(...api_auths)
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
