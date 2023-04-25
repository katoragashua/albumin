const { Router } = require("express");
const router = Router();

const { authenticateUser } = require("../middlewares/authentication");
const { getAllUsers } = require("../controllers/userControllers");

router.get("/", authenticateUser, getAllUsers);

module.exports = router;
