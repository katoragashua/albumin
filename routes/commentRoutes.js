const { Router } = require("express");
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

const {
  createComment,
  updateComment,
  deleteComment,
  createReply,
  getAllComments,
  getSingleComment
} = require("../controllers/commentAndReplyControllers");

// Comments
router.post("/", authenticateUser, createComment);
router.get("/", authenticateUser, authorizePermissions("admin"), getAllComments);
router.get("/:id", authenticateUser, getSingleComment)
router.patch("/:id", authenticateUser, updateComment);
router.delete("/:id", authenticateUser, deleteComment);
router.post("/:id/reply", authenticateUser, createReply);

module.exports = router;