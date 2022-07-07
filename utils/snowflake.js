import mongoose from "mongoose";

import {Generator} from "snowflake-generator";

const SnowflakeGenerator = new Generator(1420070400000);

export function newSnowflake() {
  return SnowflakeGenerator.generate().toString();
}

export function isSnowflake(val) {
  return /^\d{17,64}$/.test(val);
}

export class Snowflake extends mongoose.SchemaType {
  constructor(key, options) {
    super(key, options, "Snowflake");
  }

  cast(val) {
    if (val === undefined || val === null) {
      return val;
    }

    let _val = String(val);

    if (!isSnowflake(_val)) {
      throw new Error("Snowflake: " + val + " is not a snowflake");
    }
    return _val;
  }
}

mongoose.Schema.Types.Snowflake = Snowflake;

export default {Snowflake, newSnowflake, isSnowflake};
