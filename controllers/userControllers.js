const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../errors/index");
const utilFuncs = require("../utils/index");

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res
    .status(StatusCodes.OK)
    .json({ message: "Success", users, count: users.length });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError("User not found.");
  }

  res.status(StatusCodes.OK).json({ message: "Success", user });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError("");
  }
  utilFuncs.checkPermissions(res.user, user._id);

  res.status(StatusCodes.OK).json({ message: "Success", user });
};

const updateUser = async (req, res) => {
  const { id: userId } = req.params;
  const { instagram, twitter, websiteUrl } = req.body;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  utilFuncs.checkPermissions(req.user, user._id);
  const social = {
    instagram,
    twitter,
    websiteUrl,
  };
  user.social = social;
  await user.save();
  res.status(StatusCodes.OK).json({ message: "Success", user });
};

const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  utilFuncs.checkPermissions(req.user, user._id);
  await user.deleteOne();
  res.status(StatusCodes.OK).json({ message: "User removed successfully" });
};

const updateUserProfilePhoto = async (req, res) => {
  // First check if theres a file in req.files. If not, throw an error
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded.");
  }
  // If there's a req.file, assign req.files.image to a variable
  const img = req.files.image;
  console.log(img);
  // Check if the file format is an image by checking req.files.mimetype. If not, throw an error.
  if (!img.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image.");
  }

  // Optionally you can limit the size of images to 5mb
  const maxSize = 1024 * 1024 * 5;
  const minSize = 1024 * 1024 * 0.3;
  if (img.size > maxSize)
    // if (img.size > maxSize || img.size < minSize)
    throw new CustomError.BadRequestError(
      "Image must be greater than 3mb less than 15mb."
    );
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) throw new CustomError.NotFoundError("User not found");
  const profilePhoto = await utilFuncs.uploadPhoto(img.tempFilePath);
  const { secure_url } = profilePhoto;
  utilFuncs.checkPermissions(req.user, user._id);
  user.profilePhoto = secure_url;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ message: "User profile photo updated successfully." });
};

const follow = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  const currentUser = await User.findOne({ _id: req.user.userId });

  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  if (user._id === currentUser._id) {
    throw new CustomError.UnauthorizedError("Same user");
  }

  if (currentUser.following?.includes(user._id)) {
    throw new CustomError.BadRequestError("Already following user");
  }
  currentUser.following = [...currentUser.following, user._id];
  user.followers = [...user.followers, currentUser._id];
  await user.save();
  await currentUser.save();
  res
    .status(StatusCodes.OK)
    .json({ message: `Followed ${user.name.split(" ")[0]}`, currentUser });
};

const unfollow = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  const currentUser = await User.findOne({ _id: req.user.userId });

  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  if (user._id === currentUser._id) {
    throw new CustomError.UnauthorizedError("Same user");
  }

  if (!currentUser.following?.includes(user._id)) {
    throw new CustomError.BadRequestError("Not following user");
  }
  currentUser.following = currentUser.following.filter((id) => id === user._id);
  user.followers = user.followers.filter((id) => id === currentUser._id);
  await user.save();
  await currentUser.save();
  res
    .status(StatusCodes.OK)
    .json({ message: `Unfollowed ${user.name.split(" ")[0]}`, currentUser });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  follow,
  unfollow,
  updateUserProfilePhoto,
};
