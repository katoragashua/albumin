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
  likeAndUnlikePhoto,
  saveAndUnsavePhoto
} = require("../controllers/photoControllers");

router.post("/", authenticateUser, createPhoto);
router.patch("/:id/like-photo", authenticateUser, likeAndUnlikePhoto);
router.post("/:id/save-photo", authenticateUser, saveAndUnsavePhoto);
module.exports = router;
