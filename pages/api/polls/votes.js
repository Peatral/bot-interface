import nc from "next-connect";
import {
  respondWithInternalServerError,
  respondWithCreated,
  respondWithUnauthorized,
  respondWithNotFound,
  respondWithBadRequest,
} from "@utils/apiutil";
import {PollVote} from "@models/pollvote";
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
