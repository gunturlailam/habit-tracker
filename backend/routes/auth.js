    const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Endpoint register
router.post("/register", register);

// Endpoint login
router.post("/login", login);

module.exports = router;
