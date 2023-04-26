const { Router } = require("express");
const router = Router();
const { authenticateUser } = require("../middlewares/authentication");

const {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.delete("/logout", authenticateUser, logoutUser);

module.exports = router;
