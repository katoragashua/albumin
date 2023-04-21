const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../errors/index")

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

// const createUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   const user = await User.create({ name, email, password });
//   // Check if it's first user and make him admin
//   const firstUser = (await User.countDocuments()) === 1;
//   if (firstUser) {
//     user.role = "admin";
//     await user.save();
//   }

//   res.status(StatusCodes.CREATED).json(user);
// };

const getSingleUser = async (req, res) => {
    const {id: userId} = req.params
    const user = await User.findOne({_id: userid})
    if(!user) {
        throw new CustomError.NotFoundError("User not found.")
    }

    res.status(StatusCodes.OK).json(user)
};

module.exports = {
  getAllUsers,
  getSingleUser
};
