const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");
router.post(
    "/",
    protect,
    authorize("customer"),
    createBooking
);
router.get("/", getBookings);

router.get("/:id", getBookingById);

router.put("/:id", updateBooking);

router.delete("/:id", deleteBooking);

module.exports = router;