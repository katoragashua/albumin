const CustomError = require("./customError");
const { StatusCodes } = require("http-status-codes");

class UnsupportedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNSUPPORTED_MEDIA_TYPE;
  }
}

module.exports = UnsupportedError;
