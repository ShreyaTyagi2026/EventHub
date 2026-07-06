const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getAllSummaries,
  getSummaryByBooking,
} = require("../controllers/aiController");

// Organizer can view all AI summaries
router.get(
  "/",
  protect,
  authorize("organizer"),
  getAllSummaries
);

// Organizer can view AI summary of a particular booking
router.get(
  "/:bookingId",
  protect,
  authorize("organizer"),
  getSummaryByBooking
);

module.exports = router;