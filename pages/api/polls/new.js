import nc from "next-connect";
import {
  respondWithInternalServerError,
  respondWithCreated,
  respondWithUnauthorized,
  respondWithNotFound,
  respondWithBadRequest,
} from "@utils/apiutil";
import {Poll, PollEntry} from "@models/poll";
import dbConnect from "@utils/connectdb";

const checkToken = function (req, res, next) {
  if (req.query.token == process.env.API_MASTER_TOKEN) {
    next();
  } else {
    respondWithUnauthorized(res);
  }
};

export default nc({})
  .use(checkToken)
  .post(async (req, res, next) => {
    await dbConnect();

    const errors = [];

    Object.keys(req.body).forEach((key) => {
      if (!["title", "guildId", "authorId", "channelId"].includes(key)) {
        errors.push(`'${key}' is not a valid key in this request`);
      }
    });

    if (req.body.title == undefined || req.body.title === "") {
      errors.push("'title' cannot be empty");
    }

    if (errors.length > 0) {
      return respondWithBadRequest(res, errors);
    }

    const pollId = req.query.duplicate;

    if (pollId) {
      Poll.findById(pollId)
        .then((pollToDupe) => {
          if (!pollToDupe) {
            return respondWithNotFound(res, "Poll to duplicate not found");
          }

          const poll = new Poll({
            guildId: req.body.guildId,
            authorId: req.body.authorId,
            title: req.body.title,
            channelId: req.body.channelId,
            duration: pollToDupe.duration,
            minChoices: pollToDupe.minChoices,
            maxChoices: pollToDupe.maxChoices,
            roleId: pollToDupe.roleId,
            entries: pollToDupe.entries,
          });

          poll
            .save()
            .then(() => respondWithCreated(res, `/polls/${poll._id}`))
            .catch((err) => {
              if (err.code == 11000) {
                return respondWithInternalServerError(
                  res,
                  "Poll already exists",
                );
              }
              if (err.name === "ValidationError") {
                return respondWithBadRequest(res, [err.message]);
              }
              respondWithInternalServerError(res, err);
            });
        })
        .catch((err) => respondWithInternalServerError(res, err));
    } else {
      const poll = new Poll({
        guildId: req.body.guildId,
        authorId: req.body.authorId,
        title: req.body.title,
        channelId: req.body.channelId,
      });

      poll
        .save()
        .then(() => respondWithCreated(res, `/polls/${poll._id}`))
        .catch((err) => {
          if (err.code == 11000) {
            return respondWithInternalServerError(res, "Poll already exists");
          }
          if (err.name === "ValidationError") {
            return respondWithBadRequest(res, [err.message]);
          }
          respondWithInternalServerError(res, err);
        });
    }
  });
