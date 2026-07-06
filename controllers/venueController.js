const Venue = require("../models/Venue");

// ================= CREATE VENUE =================
const createVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);

    res.status(201).json({
      success: true,
      message: "Venue Created Successfully",
      venue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL VENUES =================
const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find().populate(
      "organizer",
      "name email role"
    );

    res.status(200).json({
      success: true,
      count: venues.length,
      venues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET VENUE BY ID =================
const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate(
      "organizer",
      "name email role"
    );

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    res.status(200).json({
      success: true,
      venue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE VENUE =================
const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Venue Updated Successfully",
      venue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE VENUE =================
const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Venue Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
};