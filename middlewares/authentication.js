const utilFuncs = require("../utils/index");
const Token = require("../models/Token");
const CustomError = require("../errors/index")

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  console.log(accessToken);

  // If there's an accessTokeng, go to the next middleware function
  if (accessToken) {
    const payload = await utilFuncs.verifyJWT(
      accessToken,
      process.env.JWT_SECRET
    );
    req.user = payload;
    // Return is necessary else the code will continue reading
    return next();
  }

  const payload = await utilFuncs.verifyJWT(
    refreshToken,
    process.env.JWT_SECRET
  );
  // Check if the token exists and its isValid property is true
  const token = await Token.findOne({
    user: payload.user.userId,
    refreshToken: payload.refreshToken,
  });
  if (!token || token?.isValid) {
    throw new CustomError.UnauthorizedError("Authentication invalid")
  }
  req.user = payload.user;
  utilFuncs.attachCookies(res, req.user, payload.refreshToken);
  next();
};

module.exports = {
  authenticateUser,
};
