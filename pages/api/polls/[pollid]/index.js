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

export default nc({})
  .get(async (req, res, next) => {
    await dbConnect();

    const pollId = req.query.pollid;

    Poll.findById(pollId)
      .then((poll) => {
        if (!poll) {
          return respondWithNotFound(res, "Poll not found");
        }

        res.status(200).json(poll);
      })
      .catch((err) => respondWithInternalServerError(res, err));
  })
  .patch(async (req, res, next) => {
    await dbConnect();

    const pollId = req.query.pollid;

    Poll.findById(pollId)
      .then((poll) => {
        if (!poll) {
          return respondWithNotFound(res, "Poll not found");
        }

        const changes = req.body;

        if (typeof changes.title === "string") {
          poll.title = changes.title;
        }
        if (typeof changes.duration === "number") {
          poll.duration = changes.duration;
        }
        if (typeof changes.minChoices === "number") {
          poll.minChoices = changes.minChoices;
        }
        if (typeof changes.maxChoices === "number") {
          poll.maxChoices = changes.maxChoices;
        }
        if (typeof changes.roleId === "string") {
          poll.roleId = changes.roleId;
        }
        if (Array.isArray(changes.entries)) {
          // TODO: check sub fields in the entries
          poll.entries = changes.entries;
        }

        poll
          .save()
          .then((poll) => res.status(200).json(poll))
          .catch((err) => respondWithInternalServerError(res, err));
      })
      .catch((err) => respondWithInternalServerError(res, err));
  });
