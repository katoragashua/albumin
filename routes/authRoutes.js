const { Router } = require("express");
const router = Router();

const { registerUser } = require("../controllers/authControllers");

router.post("/", registerUser);

module.exports = router;
