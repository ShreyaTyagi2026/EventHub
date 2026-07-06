const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
} = require("../services/venue.service");
// ================= CREATE =================
const createVenueController = asyncHandler(
  async (req, res) => {
    const venue = await createVenue(
      req.user._id,
      req.body
    );
    return res.status(201).json(
      new ApiResponse(
        201,
        venue,
        "Venue Created Successfully"
      )
    );
  }
);
// ================= GET ALL =================
const getVenuesController = asyncHandler(
  async (req, res) => {
    const venues = await getAllVenues();
    return res.status(200).json(
      new ApiResponse(
        200,
        venues,
        "Venues fetched successfully"
      )
    );
  }
);
// ================= GET BY ID =================
const getVenueByIdController =
  asyncHandler(async (req, res) => {
    const venue = await getVenueById(
      req.params.id
    );
    return res.status(200).json(
      new ApiResponse(
        200,
        venue,
        "Venue fetched successfully"
      )
    );
  });
// ================= UPDATE =================
const updateVenueController =
  asyncHandler(async (req, res) => {
    const venue = await updateVenue(
      req.params.id,
      req.user._id,
      req.body
    );
    return res.status(200).json(
      new ApiResponse(
        200,
        venue,
        "Venue Updated Successfully"
      )
    );
  });
// ================= DELETE =================
const deleteVenueController =
  asyncHandler(async (req, res) => {
  await deleteVenue(
      req.params.id,
      req.user._id
    );
    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Venue Deleted Successfully"
      )
    );
  });
module.exports = {
  createVenueController,
  getVenuesController,
  getVenueByIdController,
  updateVenueController,
  deleteVenueController,
}