const express = require("express");

const router = express.Router();

const {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
} = require("../controllers/venueController");

router.post("/", createVenue);

router.get("/", getVenues);

router.get("/:id", getVenueById);

router.put("/:id", updateVenue);

router.delete("/:id", deleteVenue);

module.exports = router;