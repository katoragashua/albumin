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
  const { photo: photoId, comment } = req.body;
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

// Get All Comments
const getAllComments = async (req, res) => {
  const comments = await Comment.find({});
  res.status(StatusCodes.OK).json(comments);
};

// Get Single Comment
const getSingleComment = async (req, res) => {
  const { id: commentId } = req.params;
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new CustomError.BadRequestError("Comment not found.");
  }
  res.status(StatusCodes.OK).json({ message: "Success", comment });
};

// Update Comment
const updateComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { comment } = req.body;
  const userComment = await Comment.findOne({ _id: commentId });
  if (!userComment) {
    throw new CustomError.NotFoundError("Comment not found");
  }
  utilFuncs.checkPermissions(req.user, userComment.user);
  userComment.comment = comment;
  await userComment.save();

  res.status(StatusCodes.OK).json({ message: "Comment updated.", userComment });
};

// Delete Comment
const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;
  const userComment = await Comment.findOne({ _id: commentId });
  if (!userComment) {
    throw new CustomError.NotFoundError("Photo was not found");
  }
  utilFuncs.checkPermissions(req.user, userComment.user);
  await userComment.deleteOne();

  res.status(StatusCodes.CREATED).json({ message: "Comment deleted." });
};

/*
// REPLIES
*/

// Create a Reply
const createReply = async (req, res) => {
  const { id: commentId } = req.params;
  const { reply } = req.body;
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError("Comment was not found");
  }
  const replyObj = { user: req.user.userId, comment: comment._id, reply };
  comment.replies = [...comment.replies, replyObj];
  await comment.save();
  res.status(StatusCodes.CREATED).json({ message: "Success", comment });
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
  getAllComments,
  getSingleComment,
};
