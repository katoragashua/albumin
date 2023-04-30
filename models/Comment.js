const { Schema, default: mongoose, model } = require("mongoose");
const CustomError = require("../errors/index");

const ReplySchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true },
    comment: { type: mongoose.Types.ObjectId, required: true },
    reply: { type: String, required: true },
  },
  { timestamps: true }
);

const CommentSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true },
    photo: { type: mongoose.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    replies: { type: [ReplySchema] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
