const jwt = require("jsonwebtoken");

const createJWT = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const createUserObj = (user) => {
  return {
    name: user.name,
    email: user.email,
    userId: user._id,
    role: user.role
  };
};

const verifyJWT = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  createJWT,
  createUserObj,
  verifyJWT,
};
