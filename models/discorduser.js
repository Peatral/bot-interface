import mongoose from "mongoose";
import {Snowflake, newSnowflake} from "@utils/snowflake";

const Schema = mongoose.Schema;

const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
});

const DiscordUser = new Schema({
  _id: {
    type: Snowflake,
    default: null,
  },
  discordSession: {
    refreshToken: {
      type: String,
      default: "",
    },
    accessToken: {
      type: String,
      default: "",
    },
  },
  refreshToken: {
    type: [Session],
  },
});

DiscordUser.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret.discordSession;
    return ret;
  },
});

export default mongoose.models.DiscordUser ||
  mongoose.model("DiscordUser", DiscordUser);
