const { StatusCodes } = require("http-status-codes");
const Photo = require("../models/Photo");
const CustomError = require("../errors/index");
const utilFuncs = require("../utils/index");
const User = require("../models/User");
const Comment = require("../models/Comment");

/*
// COMMENTS
*/

const createComment = async (req, res) => {
  const { id: photoId } = req.params;
  const { comment } = req.body;
  const photo = await Photo.findOne({ _id: photoId });
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was not found");
  }
  const userComment = await Comment.create({
    user: req.user.userId,
    photo: photo._id,
    comment,
  });

  res.status(StatusCodes.CREATED).json({ userComment });
};

const updateComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { comment } = req.body;
  const userComment = await Comment.findOne({ _id: commentId });
  if (!userComment) {
    throw new CustomError.NotFoundError("Photo was not found");
  }
  utilFuncs.checkPermissions(req.user, userComment.user);
  userComment.comment = comment;
  await userComment.save();

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Comment updated.", userComment });
};

const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;
  const userComment = await Comment.findOne({ _id: commentId });
  if (!userComment) {
    throw new CustomError.NotFoundError("Photo was not found");
  }
  utilFuncs.checkPermissions(req.user, userComment.user);
  await userComment.deleteOne();

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Comment was successfully deleted." });
};

/*
// REPLIES
*/

const createReply = async (req, res) => {
  const { id: commentId } = req.params;
  const { reply } = req.body;
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError("Comment was not found");
  }
  const replyObj = { user: req.user.userId, comment: comment._id, reply };
  comment.reply = [...comment.reply, replyObj];
  res.status(StatusCodes.CREATED).json({ userComment });
};

// const updateReply = async (req, res) => {
//   const { id: replyId } = req.params;
//   const comment = await Comment.findOne({ _id: commentId });
//   if (!comment) {
//     throw new CustomError.NotFoundError("Comment was not found.");
//   }
  
//   const reply = await comment.replies() 
//   res.status(StatusCodes.CREATED).json({ userComment });
// };

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  createReply,
};
