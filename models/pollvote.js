import mongoose from "mongoose";
import {Snowflake, newSnowflake} from "@utils/snowflake";

const Schema = mongoose.Schema;

const PollVoteSchema = new Schema({
  _id: {
    type: Snowflake,
    default: newSnowflake,
    required: true,
  },
  userId: {
    type: Snowflake,
    required: true,
  },
  pollId: {
    type: Snowflake,
    ref: "Poll",
    required: true,
  },
  votes: {
    type: [Snowflake],
    required: true,
  },
});

export default mongoose.models.PollVote ||
  mongoose.model("PollVote", PollVoteSchema);
