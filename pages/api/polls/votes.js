import nc from "next-connect";
import {
  respondWithInternalServerError,
  respondWithCreated,
  respondWithUnauthorized,
  respondWithNotFound,
  respondWithBadRequest,
} from "@utils/apiutil";
import PollVote from "@models/pollvote";
import api_auths from "@lib/middlewares/api_auth";

export default nc({})
  .use(...api_auths)
  .get(async (req, res, next) => {
    const userId = req.query.userId;
    const pollId = req.query.pollId;

    const filter = {};
    if (userId) {
      filter.userId = userId;
    }
    if (pollId) {
      filter.pollId = pollId;
    }

    PollVote.find(filter)
      .then((votes) => {
        res.status(200).json({
          votes: votes,
        });
      })
      .catch((err) => respondWithInternalServerError(res, err));
  });
