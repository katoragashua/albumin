const utilFuncs = require("../utils/index");
const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  console.log(accessToken);

  if (accessToken) {
    const payload = await utilFuncs.verifyJWT(
      accessToken,
      process.env.JWT_SECRET
    );
    console.log(payload);
  }
 
  next();
};

module.exports = {
  authenticateUser,
};
