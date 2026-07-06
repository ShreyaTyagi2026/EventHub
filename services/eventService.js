const Event = require("../models/Event");
const Venue = require("../models/Venue");
const Booking = require("../models/Booking");
const ApiError = require("../utils/ApiError");
// ================= CREATE =================
const createEvent = async (organizerId, eventData) => {
  const {
    title,
    description,
    date,
    time,
    ticketPrice,
    totalSeats,
    category,
    image,
    venue,
  } = eventData;
  if (
    !title ||
    !description ||
    !date ||
    !time ||
    !ticketPrice ||
    !totalSeats ||
    !category ||
    !venue
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const venueExists = await Venue.findById(venue);
  if (!venueExists) {
    throw new ApiError(404, "Venue not found");
  }
  if (
    venueExists.organizer.toString() !==
    organizerId.toString()
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }
  const duplicate = await Event.findOne({
    title,
    venue,
    date,
  });
  if (duplicate) {
    throw new ApiError(
      400,
      "Event already exists"
    );
  }
  const event = await Event.create({
    title,
    description,
    date,
    time,
    ticketPrice,
    totalSeats,
    availableSeats: totalSeats,
    category,
    image,
    organizer: organizerId,
    venue,
    status: "Upcoming",
  });
  return event;
};
// ================= GET ALL =================
const getAllEvents = async () => {
  return await Event.find()
    .populate("organizer", "name email")
    .populate("venue", "name city state");
};
// ================= GET BY ID =================
const getEventById = async (eventId) => {
  const event = await Event.findById(eventId)
    .populate("organizer", "name email")
    .populate("venue", "name city state");
  if (!event) {
    throw new ApiError(404, "Event not found");
  }
  return event;
};
// ================= UPDATE =================
const updateEvent = async (
  eventId,
  organizerId,
  updateData
) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }
  if (
    event.organizer.toString() !==
    organizerId.toString()
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }
  if (updateData.venue) {
    const venue = await Venue.findById(
      updateData.venue
    );
    if (!venue) {
      throw new ApiError(
        404,
        "Venue not found"
      );
    }
    if (
      venue.organizer.toString() !==
      organizerId.toString()
    ) {
      throw new ApiError(
        403,
        "Unauthorized Venue"
      );
    }
  }
  // Calculate booked seats
const bookedSeats = event.totalSeats - event.availableSeats;

// If organizer updates totalSeats
if (updateData.totalSeats) {
  // New total seats cannot be less than already booked seats
  if (updateData.totalSeats < bookedSeats) {
    throw new ApiError(
      400,
      "Total seats cannot be less than booked seats"
    );
  }

  // Update available seats accordingly
  updateData.availableSeats =
    updateData.totalSeats - bookedSeats;
}

// Update event
Object.assign(event, updateData);

await event.save();

return event;
};
// ================= DELETE =================
const deleteEvent = async (
  eventId,
  organizerId
) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }
  if (
    event.organizer.toString() !==
    organizerId.toString()
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }
  const bookings = await Booking.countDocuments({
    event: eventId,
  });
  if (bookings > 0) {
    throw new ApiError(
      400,
      "Cannot delete event with bookings"
    );
  }
  await event.deleteOne();
};
module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};