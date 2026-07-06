const Booking = require("../models/Booking");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { createBookingService } = require("../services/bookingService");
// ================= CREATE BOOKING =================
const createBooking = asyncHandler(async (req, res) => {
  const booking = await createBookingService(
    req.user._id,
    req.body
  );
  return res.status(201).json(
    new ApiResponse(
      201,
      booking,
      "Booking Created Successfully"
    )
  );
});
// ================= GET ALL BOOKINGS =================
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email")
      .populate("event", "title date");
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= GET BOOKING BY ID =================
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email")
      .populate("event", "title date");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= UPDATE BOOKING =================
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Booking Updated Successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= DELETE BOOKING =================
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Booking Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};