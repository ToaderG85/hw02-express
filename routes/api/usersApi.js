const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { validUserJoiSchema } = require("../../services/schemas/userJoiSchema");
const { currentUser, signup, login, logout, updateAvatar, verifyEmail, resendVerifyEmail } = require("../../models/users");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/avatars/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/signup", validUserJoiSchema, signup);

router.post("/login", login);

router.post("/logout", auth, logout);

router.get("/current", auth, currentUser);

router.patch("/avatars", auth, upload.single("avatar"),updateAvatar);

router.get("/verify/:verificationToken", verifyEmail)

router.post("/verify", resendVerifyEmail);

module.exports = router;