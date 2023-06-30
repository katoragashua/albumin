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
  saveAndUnsavePhoto,
  downloadPhoto,
} = require("../controllers/photoControllers");

// router.get("/search/:search", authenticateUser, searchPhotos);
router.post("/", authenticateUser, createPhoto);
router.get("/", getAllPhotos);
router.get("/:id", getSinglePhoto);
router.patch("/:id", authenticateUser, updatePhoto);
router.delete("/:id", authenticateUser, deletePhoto);
router.get("/:id/photos", getUserPhotos); // Note: :id here is userId

// Likes
router.post("/:id/like-photo", authenticateUser, likeAndUnlikePhoto);

// Save
router.post("/:id/save-photo", authenticateUser, saveAndUnsavePhoto);

// Download 
router.get("/:id/download", downloadPhoto);

module.exports = router;
