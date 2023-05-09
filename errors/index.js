const BadRequestError = require("./BadRequest");
const UnsupportedError = require("./UnsupportedRequest");
const UnauthenticatedError = require("./UnauthenticatedRequest");
const UnauthorizedError = require("./UnauthorizedRequest");
const NotFoundError = require("./NotFound");

module.exports = {
  BadRequestError,
  UnauthenticatedError,
  UnsupportedError,
  UnauthorizedError,
  NotFoundError
};
