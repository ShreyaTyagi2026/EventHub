const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createVenueController,
  getVenuesController,
  getVenueByIdController,
  updateVenueController,
  deleteVenueController,
} = require("../controllers/venueController");
router.post(
    "/",
    protect,
    authorize("organizer"),
    createVenueController
);
router.put(
    "/:id",
    protect,
    authorize("organizer"),
    updateVenueController
);
router.delete(
    "/:id",
    protect,
    authorize("organizer"),
    deleteVenueController
);
router.get("/", getVenuesController);
router.get("/:id", getVenueByIdController);
module.exports = router;