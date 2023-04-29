const { Router } = require("express");
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

const {
  createPhoto,
  getAllPhotos,
  getSinglePhoto,
  getUserPhotos,
  updatePhoto,
  deletePhoto,
  likePhoto,
} = require("../controllers/photoControllers");

router.post("/", authenticateUser, createPhoto);
router.patch("/:id/like-photo", authenticateUser, likePhoto);
module.exports = router;
