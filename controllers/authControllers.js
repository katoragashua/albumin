const User = require("../models/User");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const bcrypt = require("bcryptjs");
const utilFuncs = require("../utils/index");
const createToken = require("../controllers/tokenControllers");
const Token = require("../models/Token");

// Compare passwords function
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
  const { firstname, lastname, username, email, password } = req.body;
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
    firstname,
    lastname,
    username,
    email,
    password,
    role,
    verificationToken,
  });

  const origin = "http://localhost:5000";
  await utilFuncs.sendVerificationEmail({
    firstname: user.firstname,
    email: user.email,
    verificationToken: user.verificationToken,
    origin: origin,
  });

  res.status(StatusCodes.CREATED).json({
    user,
    message:
      "Please verify your account. A verification email has been sent to your email address.",
  });
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // Check if the email address and password have been provided

  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "Please provide email and password."
    );
  }
  // Check if user exists
  const user = await User.findOne({ email: email }) || await User.findOne({username: email});
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

  let refreshToken = "";
  // check if user has existing token in db/ This helps so we don't have to create multiple tokens for one user
  // Since we don't want to keep creating token documents on every login. We can check if a token exists already where the user property is set to the users _id property (user._id). If it does, we check if the existingToken' isValid property is set to true and set the refresh token declared above to the existingToken. Else we throw an error if the existingToken' isValid property is set to false
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    refreshToken = existingToken.refreshToken;

    await utilFuncs.attachCookies(res, tokenUser, refreshToken);
    res
      .status(StatusCodes.OK)
      .json({ user, message: "Successfully logged in." });
    return;
  }
  //
  refreshToken = crypto.randomBytes(40).toString("hex");
  const ip = req.ip;
  const userAgent = req.get("user-agent");

  // Create and an object to model the token schema
  const tokenObj = { refreshToken, ip, userAgent, user: user._id };
  // Create token
  await Token.create(tokenObj);

  await utilFuncs.attachCookies(res, tokenUser, refreshToken);
  res.status(StatusCodes.OK).json({ user, message: "Successfully logged in." });
};

// Logout User
const logoutUser = async (req, res) => {
  console.log(req.user);
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "user logged out!" });
};

// Verify Email
const verifyEmail = async (req, res) => {
  const { token, email } = req.body;
  // Check for user
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  // Check if verificationToken equals the user's verificationToken'
  if (user.verificationToken !== token) {
    throw new CustomError.UnauthenticatedError("Verification failed");
  }

  // Verify user, set verified to a date, and verificationToken to ""
  user.isVerified = true;
  user.verified = new Date(Date.now());
  user.verificationToken = "";
  await user.save();

  res.status(StatusCodes.OK).json({ message: "User verified", user });
};

// Forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Please provide email");
  }
  const user = await User.findOne({ email });
  const origin = "http://localhost:5000";
  if (user) {
    const passwordToken = crypto.randomBytes(40).toString("hex");

    await utilFuncs.sendResetEmail({
      firstname: user.firstname,
      email: user.email,
      passwordToken,
      origin,
    });

    const oneHour = 1000 * 60 * 60;
    const passwordTokenExpiration = new Date(Date.now() + oneHour);
    user.passwordToken = passwordToken;
    user.passwordTokenExpiration = passwordTokenExpiration;
    await user.save();
  }

  res.status(StatusCodes.OK).json({ message: "Success! A reset link has been sent to your email." });
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    if (
      !(user.passwordTokenExpiration > currentDate) ||
      !(user.passwordToken === token)
    ) {
      throw new CustomError.UnauthenticatedError("Invalid or expired token");
    }
    user.password = password;
    user.passwordToken = null;
    user.passwordTokenExpiration = null;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Successfully changed password.", user });
};

// const sendEmail = async (req, res) => {
//     sgMail.setApiKey(process.env.BANANA_BANDIT_KEY)
//     const message = {
//       to: "katoragashua@gmail.com", // Change to your recipient
//       from: "katoragashua@outlook.com", // Change to your verified sender
//       subject: "Sending with SendGrid is Fun",
//       // text: "and easy to do anywhere, even with Node.js",
//       html: "<strong>and easy to do anywhere, even with Node.js</strong>",
//     };
//     const info = await sgMail.send(message);
//     // res.json(info);
//     return info
// }

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
