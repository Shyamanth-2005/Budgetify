const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { modelName } = require("../models/User");
const router = express.Router();
router.get("", protect, getDashboardData);
module.exports = router;
