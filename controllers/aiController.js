const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const AiSummary = require("../models/AiSummary");

// ================= GET ALL AI SUMMARIES =================

const getAllSummaries = asyncHandler(async (req, res) => {
  const summaries = await AiSummary.find()
    .populate({
      path: "booking",
      populate: [
        {
          path: "customer",
          select: "name email",
        },
        {
          path: "event",
          select: "title date",
        },
      ],
    })
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      summaries,
      "AI Summaries fetched successfully"
    )
  );
});

// ================= GET SUMMARY BY BOOKING =================

const getSummaryByBooking = asyncHandler(async (req, res) => {
  const summary = await AiSummary.findOne({
    booking: req.params.bookingId,
  }).populate({
    path: "booking",
    populate: [
      {
        path: "customer",
        select: "name email",
      },
      {
        path: "event",
        select: "title date",
      },
    ],
  });

  if (!summary) {
    return res.status(404).json({
      success: false,
      message: "AI Summary not found",
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      summary,
      "AI Summary fetched successfully"
    )
  );
});

module.exports = {
  getAllSummaries,
  getSummaryByBooking,
};