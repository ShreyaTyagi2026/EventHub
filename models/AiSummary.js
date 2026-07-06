const mongoose = require("mongoose");

const aiSummarySchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Booking Summary",
        "Event Performance",
        "Daily Summary",
      ],
      default: "Booking Summary",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AiSummary", aiSummarySchema);