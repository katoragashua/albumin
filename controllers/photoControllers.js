const { StatusCodes } = require("http-status-codes");
const Photo = require("../models/Photo");
const CustomError = require("../errors/index");
const utilFuncs = require("../utils/index");
const User = require("../models/User");

const createPhoto = async (req, res) => {
  const { description, url } = req.body;
  if(!description || !url) {
    throw new CustomError.BadRequestError("Please enter a description or url")
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) throw new CustomError.NotFoundError("User not found");
  const photo = await Photo.create({ description, url, user });
  res.status(StatusCodes.CREATED).json({ photo });
};


module.exports = {
    createPhoto
}