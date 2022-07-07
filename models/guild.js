import mongoose from "mongoose";
import {Snowflake, newSnowflake} from "@utils/snowflake";

const Schema = mongoose.Schema;
const Guild = new Schema({
  _id: {
    type: Snowflake,
    required: true,
  },
  admins: {
    type: [Snowflake],
    default: [],
  },
});

export default mongoose.model("Guild", Guild);
