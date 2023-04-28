const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../errors/index");
const utilFuncs = require("../utils/index");

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError("User not found.");
  }

  res.status(StatusCodes.OK).json(user);
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError("");
  }
  utilFuncs.checkPermissions(res.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { id: userId } = req.params;
  const { instagram, twitter, portfolioUrl } = req.body;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  utilFuncs.checkPermissions(req.user, user._id);
  const social = {
    instagram,
    twitter,
    portfolioUrl,
  };
  user.social = social;
  await user.save();
  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  utilFuncs.checkPermissions(req.user, user._id);
  await user.deleteOne();
  res.status(StatusCodes.OK).json({msg: "User removed successfully"});
}


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
    .json({ msg: `Followed ${user.name.split(" ")[0]}`, currentUser });
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
    .json({ msg: `Unfollowed ${user.name.split(" ")[0]}`, currentUser });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  follow,
  unfollow,
};
