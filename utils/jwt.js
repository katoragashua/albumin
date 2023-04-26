const jwt = require("jsonwebtoken");

const createJWT = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const attachCookies = async (res, user, refreshToken) => {
  const accessTokenJWT = await createJWT(user);
  const refreshTokenJWT = await createJWT({ user, refreshToken });
  const expiration = 1000 * 60 * 30;
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: expiration,
  });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: oneDay,
  });
};

const createUserObj = (user) => {
  return {
    name: user.name,
    email: user.email,
    userId: user._id,
    role: user.role,
  };
};

const verifyJWT = async (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  createJWT,
  createUserObj,
  verifyJWT,
};
