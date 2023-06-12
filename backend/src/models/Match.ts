import * as mongoose from "mongoose";

const Schema = mongoose.Schema;
const matchSchema = new Schema(
  {
    nickname: String,
    time: Number,
  },
  { timestamps: true, versionKey: false }
);

const Match = mongoose.model("Match", matchSchema);
module.exports = Match;
