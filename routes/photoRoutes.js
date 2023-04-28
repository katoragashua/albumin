const { Router } = require("express");
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const {
  createPhoto
} = require("../controllers/photoControllers");

router.post("/:id", authenticateUser, createPhoto);

module.exports = router;
