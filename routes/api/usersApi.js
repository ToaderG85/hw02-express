const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { validUserJoiSchema } = require("../../services/schemas/userJoiSchema");
const { currentUser, signup, login, logout } = require("../../models/users");

router.post("/signup", validUserJoiSchema, signup);

router.post("/login", login);

router.post("/logout", auth, logout);

router.get("/current", auth, currentUser);

module.exports = router;