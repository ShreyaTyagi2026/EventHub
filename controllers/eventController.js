const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../services/eventService");
// CREATE
const createEventController = asyncHandler(async (req, res) => {
  const event = await createEvent(
    req.user._id,
    req.body
  );
  return res.status(201).json(
    new ApiResponse(
      201,
      event,
      "Event Created Successfully"
    )
  );
});
// GET ALL
const getEventsController = asyncHandler(async (req, res) => {
  const events = await getAllEvents();
  return res.status(200).json(
    new ApiResponse(
      200,
      events,
      "Events fetched successfully"
    )
  );
});
// GET BY ID
const getEventByIdController = asyncHandler(async (req, res) => {
  const event = await getEventById(
    req.params.id
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      event,
      "Event fetched successfully"
    )
  );
});
// UPDATE
const updateEventController = asyncHandler(async (req, res) => {
  const event = await updateEvent(
    req.params.id,
    req.user._id,
    req.body
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      event,
      "Event Updated Successfully"
    )
  );
});
// DELETE
const deleteEventController = asyncHandler(async (req, res) => {
  await deleteEvent(
    req.params.id,
    req.user._id
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Event Deleted Successfully"
    )
  );
});
module.exports = {
  createEventController,
  getEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
};