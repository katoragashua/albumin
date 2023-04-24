const attachCookies = (res, accessToken, refreshToken) => {
  const expiration = 1000 * 60 * 30;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: expiration,
  });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: oneDay,
  });
};

module.exports = attachCookies;
