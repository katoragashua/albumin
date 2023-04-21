const User = require("../models/User");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const bcrypt = require("bcryptjs");
const utilFuncs = require("../utils/index");
const createToken = require("../controllers/tokenControllers");
const Token = require("../models/Token");

const comparePasswords = async (password, userPassword) => {
  const isCorrectPassword = await bcrypt.compare(password, userPassword);
  if (!isCorrectPassword) {
    throw new CustomError.UnauthenticatedError(
      "Please enter a correct password."
    );
  }
  return isCorrectPassword;
};

// Register users
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  // Besides the unique property in the schema we want to check if a user with that email exists already
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // Check if it's first user and make him admin
  const firstUser = (await User.countDocuments()) === 0;
  const role = firstUser ? "admin" : "user";
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  const origin = "http://localhost:5000";
  await utilFuncs.sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin: origin,
  });

  res.status(StatusCodes.CREATED).json({
    user,
    msg: "Please verify your account. A verification email has been sent to your email address.",
  });
};

const login = async (req, res) => {
  const { email, password } = req.bod;
  // Check if the email address and password have been provided

  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "Please provide a valid email address and password"
    );
  }
  // Check if user exists
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  // Check if user if verified
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify your account");
  }
  // compare the passwords
  await comparePasswords(password, user.password);
  const tokenUser = utilFuncs.createUserObj(user);

  //   let refreshToken = "";
  //   // check if user has existing token in db/ This helps so we don't have to create multiple tokens for one user
  //   const existingToken = await Token.findOne({ user: user._id });
  //   if (existingToken) {
  //     const { isValid } = existingToken;
  //     if (!isValid) {
  //       throw new CustomError.UnauthenticatedError("Invalid credentials");
  //     }
  //     refreshToken = existingToken.refreshToken;
  //   }
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const ip = req.ip;
  const userAgent = req.get("user-agent");
  // Create and an object to model the token schema
  const tokenObj = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(tokenObj);
  const accessTokenJWT = await utilFuncs.createJWT({ tokenUser });
  const refreshTokenJWT = await utilFuncs.createJWT({
    tokenUser,
    refreshToken,
  });

  attachCookies(res, accessTokenJWT, refreshTokenJWT);
  res.status(StatusCodes.OK).json({ user, msg: "Successfully logged in." });
};

const verifyAccount = async (req, res) => {
  const { verificationToken, email } = req.body;
  // Check for user
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  // Check if verificationToken equals the user's verificationToken'
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError("Verification failed");
  }

  // Verify user, set verified to a date, and verificationToken to ""
  user.isVerified = true;
  user.verified = new Date(Date.now());
  user.verificationToken = "";
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "User verified", user });
};

module.exports = {
  registerUser,
  login,
};
