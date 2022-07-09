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

const checkToken = function (req, res, next) {
  if (req.query.token == process.env.API_MASTER_TOKEN) {
    next();
  } else {
    respondWithUnauthorized(res);
  }
};

export default nc({}).post(async (req, res, next) => {
  await dbConnect();

  const pollId = req.query.pollid;
  const userId = req.body.userId;
  const votes = req.body.votes;

  Poll.findById(pollId)
    .then((poll) => {
      if (!poll) {
        return respondWithNotFound(res, "Poll not found");
      }

      const pollEntries = poll.entries.map((entry) => entry._id);

      const errors = [];

      if (poll.status !== "OPEN") {
        errors.push("The poll has to be open to vote");
      }

      votes.forEach((vote) => {
        if (!pollEntries.includes(vote)) {
          errors.push(`'${vote}' is not a valid entry for this poll`);
        }
      });
      if (errors.length > 0) {
        return respondWithBadRequest(res, errors);
      }

      PollVote.findOneAndUpdate(
        {
          pollId: pollId,
          userId: userId,
        },
        {
          $set: {
            votes: votes,
          },
        },
        {
          setDefaultsOnInsert: true,
          upsert: true,
          new: true,
        },
      )
        .then((vote) => res.status(200).send(vote))
        .catch((err) => respondWithInternalServerError(res, err));
    })
    .catch((err) => respondWithInternalServerError(res, err));
});
