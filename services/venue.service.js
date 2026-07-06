const Venue = require("../models/Venue");
const ApiError = require("../utils/ApiError");
// ================= CREATE VENUE =================
const createVenue = async (organizerId, venueData) => {
  const { name, address, city, state, capacity } = venueData;
  if (!name || !address || !city || !state || !capacity) {
    throw new ApiError(400, "All fields are required");
  }
  const existingVenue = await Venue.findOne({
    name,
    address,
  });
  if (existingVenue) {
    throw new ApiError(400, "Venue already exists");
  }
  const venue = await Venue.create({
    name,
    address,
    city,
    state,
    capacity,
    organizer: organizerId,
  });
  return venue;
};
// ================= GET ALL VENUES =================
const getAllVenues = async () => {
  return await Venue.find()
    .populate("organizer", "name email");
};
// ================= GET VENUE BY ID =================
const getVenueById = async (venueId) => {
  const venue = await Venue.findById(venueId)
    .populate("organizer", "name email");
  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }
  return venue;
};
// ================= UPDATE VENUE =================
const updateVenue = async (
  venueId,
  organizerId,
  updateData
) => {
  const venue = await Venue.findById(venueId);
  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }
  if (
    venue.organizer.toString() !==
    organizerId.toString()
  ) {
    throw new ApiError(
      403,
      "You can update only your own venue"
    );
  }
  Object.assign(venue, updateData);
  await venue.save();
  return venue;
};
// ================= DELETE VENUE =================
const deleteVenue = async (
  venueId,
  organizerId
) => {
  const venue = await Venue.findById(venueId);
  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }
  if (
    venue.organizer.toString() !==
    organizerId.toString()
  ) {
    throw new ApiError(
      403,
      "You can delete only your own venue"
    );
  }
  await venue.deleteOne();
  return;
};
module.exports = {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
};