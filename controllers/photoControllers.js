const { StatusCodes } = require("http-status-codes");
const Photo = require("../models/Photo");
const CustomError = require("../errors/index");
const utilFuncs = require("../utils/index");
const User = require("../models/User");
const Comment = require("../models/Comment");

/*
// PHOTOS 
*/

// Create Photo
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
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Photo saved successfully.", photo });
};

// Get User Photos
const getUserPhotos = async (req, res) => {
  const photos = await Photo.find({ user: req.user.userId });
  res
    .status(StatusCodes.OK)
    .json({ message: "Success", results: photos, count: photos.length });
};

// Get All Photos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort("-createdAt");
  res
    .status(StatusCodes.OK)
    .json({ message: "Success", results: photos, count: photos.length });
};

// Get Single Photos
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
  await photo.populate("comments");
  res.status(StatusCodes.OK).json({ message: "Success", photo });
};

// Update Photo
const updatePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const photo = await Photo.findOne({ _id: photoId, user: req.user.userId });
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was not found");
  }
  console.log(photo.user);
  utilFuncs.checkPermissions(req.user, photo.user);
  res.status(StatusCodes.OK).json({ message: "Success", photo });
};

// Delete Photo
const deletePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const photo = await Photo.findOne({
    _id: photoId,
  });
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was not found");
  }
  utilFuncs.checkPermissions(req.user, photo.user);
  await Comment.deleteMany({photo: photoId});
  await photo.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Photo deleted" });
};

// Like and Unlike Photo
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
    res.status(StatusCodes.OK).json({ message: "Liked photo", photo });
    return;
  } else {
    await photo.likes.pull(userId);
    await photo.save();
    console.log(photo.user);
    res.status(StatusCodes.OK).json({ message: "Unliked photo", photo });
    return;
  }
};

// Save and Unsave Photo
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

module.exports = {
  createPhoto,
  getAllPhotos,
  getSinglePhoto,
  getUserPhotos,
  updatePhoto,
  deletePhoto,
  likeAndUnlikePhoto,
  saveAndUnsavePhoto,
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
//   res.status(StatusCodes.OK).json({ message: "Liked photo", photo });
// };
