const Token = require("../models/Token");
const crypto = require("crypto");

const createToken = async (req, res, user) => {
  const tokenObj = {};
  tokenObj.refreshToken = crypto.randomBytes(40).toString("hex");
  tokenObj.userAgent = req.get("user-agent");
  tokenObj.ip = req.ip;
  tokenObj.user = user._id;
  const token = await Token.create(tokenObj);
  return token;
};

module.exports = createToken;
