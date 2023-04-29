const { StatusCodes } = require("http-status-codes");
const Photo = require("../models/Photo");
const CustomError = require("../errors/index");
const utilFuncs = require("../utils/index");
const User = require("../models/User");

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

const likePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const photo = await Photo.findOne({ _id: photoId });
  // const user = await User.findOne({_id: req.user.userId})
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was no found");
  }
  const likeObj = {
    user: req.user.userId,
    photo: photo._id,
  };
  photo.likes = [...photo.likes, likeObj];
  await photo.save();
  console.log(photo.user);
  res.status(StatusCodes.OK).json({ msg: "Liked photo", photo });
};

const unlikePhoto = async (req, res) => {};

const bookmarkPhoto = async (req, res) => {};

const unbookmarkPhoto = async (req, res) => {};

module.exports = {
  createPhoto,
  getAllPhotos,
  getSinglePhoto,
  getUserPhotos,
  updatePhoto,
  deletePhoto,
  likePhoto,
  unlikePhoto,
};
