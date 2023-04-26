const CustomError = require("../errors/index")

// This function is used to handle request coming from users that aren't the admin, and are not owners of the resource they are trying to access. This helps so that a user cannot access or modify a resource that isn't theirs.
const checkPermissions = (requestUser, id) => {
    if(requestUser.role === 'admin') {
        return
    }
    if(requestUser.userId === id.toString()) {
        return
    }
    throw new CustomError.UnauthorizedError("Not authorized")
};

module.exports = checkPermissions;
