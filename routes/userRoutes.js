const { Router } = require("express");
const router = Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  follow,
  unfollow,
} = require("../controllers/userControllers");

router.get("/", authenticateUser, authorizePermissions("admin"), getAllUsers);
router.get(
  "/my-account",
  authenticateUser,
  getCurrentUser
);

router.patch(
  "/:id/follow",
  authenticateUser,
  follow
);

router.patch(
  "/:id/unfollow",
  authenticateUser,
  unfollow
);

router.get("/:id", authenticateUser, getSingleUser);

module.exports = router;
