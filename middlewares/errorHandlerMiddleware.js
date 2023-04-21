const { StatusCodes } = require("http-status-codes");

const errorHandler = async (req, res, next, error) => {
    res.status(error.statusCode).json(error)
    next()
}

module.exports = errorHandler