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
    const userId = req.body.userId;
    const votes = req.body.votes;

    if (!votes || votes.length <= 0) {
      return respondWithBadRequest(res, "Votes cannot be empty");
    }

    if (!userId || userId === "") {
      return respondWithBadRequest(res, "UserID cannot be empty");
    }

    Poll.findById(pollId)
      .then((poll) => {
        if (!poll) {
          return respondWithNotFound(res, "Poll not found");
        }

        if (!poll.entries || poll.entries.length <= 0) {
          return respondWithInternalServerError(
            res,
            "Poll entries are not allowed to be empty",
          );
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
          .catch((err) =>
            respondWithInternalServerError(
              res,
              `Error while updating Vote: ${err}`,
            ),
          );
      })
      .catch((err) =>
        respondWithInternalServerError(
          res,
          `Error while querying Poll: ${err}`,
        ),
      );
  });
