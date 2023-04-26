const sendEmail = require("./sendEmail");
const sendVerificationEmail = require("./sendVerificationEmail");
const { createJWT, createUserObj, verifyJWT, attachCookies } = require("./jwt");
const checkPermissions = require("./checkPermissions");
const sendResetEmail = require("./sendResetEmail");

module.exports = {
  sendEmail,
  sendVerificationEmail,
  createJWT,
  createUserObj,
  verifyJWT,
  checkPermissions,
  attachCookies,
  sendResetEmail,
};
