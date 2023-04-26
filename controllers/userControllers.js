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
  const user = await User.findOne({ _id: userid });
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
  const {instagram, twitter, profileUrl } = req.body;
  
};

module.exports = {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
};
