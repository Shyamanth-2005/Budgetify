const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // Import the protect middleware
const upload = require("../middleware/uploadMiddleware"); // Import the upload middleware
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");

const router = express.Router();
router.post("/register", registerUser); // Route for user registration
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ imageUrl });
});
module.exports = router; // Export the router for use in other files
