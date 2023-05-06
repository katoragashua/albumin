const { StatusCodes } = require("http-status-codes");
const Photo = require("../models/Photo");
const CustomError = require("../errors/index");
const utilFuncs = require("../utils/index");
const User = require("../models/User");
const Comment = require("../models/Comment");

/*
// PHOTOS 
*/

const createPhoto = async (req, res) => {
  const { description, url } = req.body;
  if (!description || !url) {
    throw new CustomError.BadRequestError("Please enter a description or url");
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) throw new CustomError.NotFoundError("User not found");
  const photo = await Photo.create({ description, url, user: req.user.userId });
  await photo.populate({
    path: "user",
    select:
      "name firstName, lastName, username, email, availableForWork, userImage, location, social",
  });
  //   await photo.save()
  console.log(photo);
  res.status(StatusCodes.CREATED).json({ photo });
};

const getUserPhotos = async (req, res) => {
  const photos = await Photo.find({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ results: photos, count: photos.length });
};

const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort("-createdAt");
  res.status(StatusCodes.OK).json({ results: photos, count: photos.length });
};

const getSinglePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const photo = await Photo.findOne({ _id: photoId });
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was no found");
  }
  await photo.populate({
    path: "user",
    select:
      "name firstName, lastName, username, email, availableForWork, userImage, location, social",
  });
  res.status(StatusCodes.OK).json(photo);
};

const updatePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const photo = await Photo.findOne({ _id: photoId, user: req.user.userId });
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was no found");
  }
  console.log(photo.user);
  utilFuncs.checkPermissions(req.user, photo.user);
  res.status(StatusCodes.OK).json(photo);
};

const deletePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const photo = await Photo.findOne({
    _id: photoId,
    user: req.user.userId,
  });
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was no found");
  }
  utilFuncs.checkPermissions(req.user, photo.user);
  await photo.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Photo deleted" });
};

const likeAndUnlikePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const { userId } = req.user;
  const photo = await Photo.findOne({ _id: photoId });
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was not found");
  }

  if (!photo.likes.includes(userId)) {
    // photo.likes = [...photo.likes, userId]; // or
    await photo.likes.push(userId);
    await photo.save();
    console.log(photo.user);
    res.status(StatusCodes.OK).json({ msg: "Liked photo", photo });
    return;
  } else {
    await photo.likes.pull(userId);
    await photo.save();
    console.log(photo.user);
    res.status(StatusCodes.OK).json({ msg: "Unliked photo", photo });
    return;
  }
};

const saveAndUnsavePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  console.log(photoId);
  const { userId } = req.user;
  const photo = await Photo.findById({ _id: photoId });
  if (!photo) throw new CustomError.BadRequestError("Photo not found.");
  const user = await User.findById({ _id: userId });
  if (!user.savedPhotos.includes(photoId)) {
    await user.savedPhotos.push(photoId);
    await user.save();
    return res.status(StatusCodes.OK).json({ message: "Photo saved.", user });
  } else {
    await user.savedPhotos.pull(photoId);
    await user.save();
    return res.status(StatusCodes.OK).json({ message: "Photo unsaved.", user });
  }
};

const unSavePhoto = async (req, res) => {};

/*
// COMMENTS
*/

const createPhotoComment = async (req, res) => {
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

// const deleteReply = async (req, res) => {
//   const { id: replyId } = req.params;
//   const comment = await Comment.findOne({ _id: commentId });
//   if (!comment) {
//     throw new CustomError.NotFoundError("Comment was not found");
//   }
//   const replyObj = { user: req.user.userId, comment: comment._id, reply };
//   comment.reply = [...comment.reply, replyObj];
//   res.status(StatusCodes.CREATED).json({ userComment });
// };

module.exports = {
  createPhoto,
  getAllPhotos,
  getSinglePhoto,
  getUserPhotos,
  updatePhoto,
  deletePhoto,
  likeAndUnlikePhoto,
  saveAndUnsavePhoto
};

// const likePhoto = async (req, res) => {
//   const { id: photoId } = req.params;
//   const photo = await Photo.findOne({ _id: photoId });
//   // const user = await User.findOne({_id: req.user.userId})
//   if (!photo) {
//     throw new CustomError.NotFoundError("Photo was not found");
//   }
//   const likeObj = {
//     user: req.user.userId,
//     photo: photo._id,
//   };

//   for (like of photo.likes) {
//     if (like.user.toString() === likeObj.user) {
//       throw new CustomError.UnauthorizedError("Photo already liked by user");
//     }
//     photo.likes = [...photo.likes, likeObj];
//   }
//   await photo.save();
//   console.log(photo.user);
//   res.status(StatusCodes.OK).json({ msg: "Liked photo", photo });
// };
