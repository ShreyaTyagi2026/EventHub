const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  createEventController,
  getEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
} = require("../controllers/eventController");
router.get("/", getEventsController);
router.get("/:id", getEventByIdController);
router.post(
  "/",
  protect,
  authorize("organizer"),
  createEventController
);
router.put(
  "/:id",
  protect,
  authorize("organizer"),
  updateEventController
);
router.delete(
  "/:id",
  protect,
  authorize("organizer"),
  deleteEventController
);
module.exports = router;