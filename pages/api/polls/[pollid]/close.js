import nc from "next-connect";
import {
  respondWithInternalServerError,
  respondWithCreated,
  respondWithUnauthorized,
  respondWithNotFound,
  respondWithBadRequest,
} from "@utils/apiutil";
import {Poll, PollEntry} from "@models/poll";
import {PollVote} from "@models/pollvote";
import dbConnect from "@utils/connectdb";
import {useRouter} from "next/router";

const checkToken = function (req, res, next) {
  if (req.query.token == process.env.API_MASTER_TOKEN) {
    next();
  } else {
    respondWithUnauthorized(res);
  }
};

export default nc({}).post(async (req, res, next) => {
  await dbConnect();

  const Router = useRouter();
  const pollId = Router.query.pollid;

  Poll.findById(pollId)
    .then((poll) => {
      if (!poll) {
        return respondWithNotFound(res, "Poll not found");
      }

      if (poll.status !== "OPEN") {
        return respondWithBadRequest(res, ["Poll has to be open to be closed"]);
      }

      (poll.status = "CLOSED"), (poll.endTimestamp = Date.now());

      poll
        .save()
        .then((poll) => res.status(200).json(poll))
        .catch((err) => respondWithInternalServerError(res, err));
    })
    .catch((err) => respondWithInternalServerError(res, err));
});
