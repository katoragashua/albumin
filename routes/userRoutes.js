const { Router } = require("express");
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const { getAllUsers } = require("../controllers/userControllers");

router.get("/", authenticateUser, authorizePermissions("admin"), getAllUsers);

module.exports = router;
