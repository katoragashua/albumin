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
} = require("../controllers/photoControllers");

const {
  createComment,
  updateComment,
  deleteComment,
  createReply,
} = require("../controllers/commentAndReplyControllers");

router.post("/", authenticateUser, createPhoto);
router.get("/", authenticateUser, getAllPhotos);
router.get("/:id", authenticateUser, getSinglePhoto);
router.patch("/:id", authenticateUser, updatePhoto);
router.delete("/:id", authenticateUser, deletePhoto);
router.get("/:id/photos", authenticateUser, getUserPhotos); // Note: :id here is userId

// Likes
router.post("/:id/like-photo", authenticateUser, likeAndUnlikePhoto);

// Save
router.post("/:id/save-photo", authenticateUser, saveAndUnsavePhoto);

// Comments
router.post("/:id/create-comment", authenticateUser, createComment);
router.post("/:id/update-comment", authenticateUser, updateComment);
router.delete("/:id/delete-comment", authenticateUser, deleteComment);
router.post("/:id/create-reply", authenticateUser, createReply);

module.exports = router;
