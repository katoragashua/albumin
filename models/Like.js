const { Schema, default: mongoose, model } = require("mongoose");

const LikeSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", unique: true },
    photo: { type: mongoose.Types.ObjectId, ref: "Photo" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", LikeSchema);
