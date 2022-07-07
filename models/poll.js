import mongoose from "mongoose";
import {Snowflake, newSnowflake} from "@utils/snowflake";

const Schema = mongoose.Schema;
const PollEntrySchema = new Schema({
  _id: {
    type: Snowflake,
    default: newSnowflake,
    required: true,
  },
  label: {
    type: String,
    default: "",
    required: true,
  },
  description: {
    type: String,
    default: "",
    required: true,
  },
  icon: {
    type: String,
    default: "",
  },
});
export const PollEntry = mongoose.model("PollEntry", PollEntrySchema);

const PollSchema = new Schema({
  _id: {
    type: Snowflake,
    default: newSnowflake,
    required: true,
  },
  entries: {
    type: [PollEntrySchema],
    default: [
      {
        label: "Yes",
        description: "Your wish shall be granted...",
        icon: "",
      },
      {
        label: "No",
        description: "Therefore I rightfully object and say: No",
        icon: "",
      },
    ],
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["SCHEDULED", "OPEN", "CLOSED"],
    default: "SCHEDULED",
  },
  duration: {
    type: Number,
    default: 1000 * 60 * 5, // 5 minutes
  },
  minChoices: {
    type: Number,
    default: 1,
  },
  maxChoices: {
    type: Number,
    default: 1,
  },
  // identifying ids
  roleId: {
    type: Snowflake,
    default: null,
  },
  messageId: {
    type: Snowflake,
    default: null,
  },
  channelId: {
    type: Snowflake,
    default: null,
  },
  guildId: {
    type: Snowflake,
    ref: "Guild",
    required: true,
  },
  authorId: {
    type: Snowflake,
    required: true,
  },
  // Timestamps
  startTimestamp: {
    type: Number,
    default: -1,
  },
  endTimestamp: {
    type: Number,
    default: -1,
  },
});
export const Poll = mongoose.model("Poll", PollSchema);

export default {Poll, PollEntry, PollSchema};
