const Booking = require("../models/Booking");
const Event = require("../models/Event");
const User = require("../models/User");

const ApiError = require("../utils/ApiError");

const {
  generateBookingSummary,
} = require("./ai.service");

// ================= CREATE BOOKING =================

const createBookingService = async (userId, bookingData) => {
  const { event: eventId, tickets } = bookingData;

  if (!eventId || !tickets) {
    throw new ApiError(400, "Event and tickets are required");
  }

  if (tickets <= 0) {
    throw new ApiError(400, "Tickets must be greater than 0");
  }

  // Find Event
  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Booking only for Upcoming events
  if (event.status !== "Upcoming") {
    throw new ApiError(
      400,
      "Booking is allowed only for upcoming events"
    );
  }

  // Seat validation
  if (event.availableSeats < tickets) {
    throw new ApiError(
      400,
      "Not enough seats available"
    );
  }

  // Calculate total amount
  const totalAmount = tickets * event.ticketPrice;

  // Reduce seats
  event.availableSeats -= tickets;
  await event.save();

  // Create Booking
  const booking = await Booking.create({
    customer: userId,
    event: eventId,
    tickets,
    totalAmount,
    bookingStatus: "Confirmed",
  });

  // Fetch Customer
const customer = await User.findById(userId).select(
  "name email"
);

  // Generate AI Summary
  await generateBookingSummary(
    booking,
    customer,
    event
  );

  return booking;
};

// ================= GET MY BOOKINGS =================

const getMyBookingsService = async (customerId) => {
  return await Booking.find({
    customer: customerId,
  })
    .populate("event")
    .sort({ createdAt: -1 });
};

// ================= GET BOOKING BY ID =================

const getBookingByIdService = async (
  bookingId,
  customerId
) => {
  const booking = await Booking.findById(bookingId)
    .populate("event")
    .populate("customer", "name email");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (
    booking.customer._id.toString() !==
    customerId.toString()
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  return booking;
};

// ================= UPDATE BOOKING =================

const updateBookingService = async (
  bookingId,
  customerId,
  tickets
) => {

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (
    booking.customer.toString() !==
    customerId.toString()
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  if (booking.bookingStatus === "Cancelled") {
    throw new ApiError(
      400,
      "Cancelled booking cannot be updated"
    );
  }

  const event = await Event.findById(
    booking.event
  );

  const difference = tickets - booking.tickets;

  if (difference > event.availableSeats) {
    throw new ApiError(
      400,
      "Not enough seats available"
    );
  }

  event.availableSeats -= difference;

  booking.tickets = tickets;

  booking.totalAmount =
    tickets * event.ticketPrice;

  await event.save();

  await booking.save();

  return booking;
};

// ================= CANCEL BOOKING =================

const cancelBookingService = async (
  bookingId,
  customerId
) => {

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (
    booking.customer.toString() !==
    customerId.toString()
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  if (booking.bookingStatus === "Cancelled") {
    throw new ApiError(
      400,
      "Booking already cancelled"
    );
  }

  const event = await Event.findById(
    booking.event
  );

  event.availableSeats += booking.tickets;

  await event.save();

  booking.bookingStatus = "Cancelled";

  await booking.save();

  return booking;
};

// ================= DELETE BOOKING =================

const deleteBookingService = async (
  bookingId,
  customerId
) => {

  const booking = await Booking.findById(
    bookingId
  );

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (
    booking.customer.toString() !==
    customerId.toString()
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  if (booking.bookingStatus !== "Cancelled") {
    throw new ApiError(
      400,
      "Cancel booking first"
    );
  }

  await booking.deleteOne();
};

// ================= ORGANIZER BOOKINGS =================

const getOrganizerBookingsService = async (
  organizerId
) => {

  const events = await Event.find({
    organizer: organizerId,
  }).select("_id");

  const eventIds = events.map(
    (event) => event._id
  );

  return await Booking.find({
    event: {
      $in: eventIds,
    },
  })
    .populate("customer", "name email")
    .populate("event", "title date");
};

module.exports = {
  createBookingService,
  getMyBookingsService,
  getBookingByIdService,
  updateBookingService,
  cancelBookingService,
  deleteBookingService,
  getOrganizerBookingsService,
};