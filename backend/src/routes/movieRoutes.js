const express = require("express");
const { protect, optionalAuth } = require("../middleware/authMiddleware");
const {
  getMovies,
  getMovie,
  markWatched,
  rateMovie,
  syncMoviesFromArchive
} = require("../controllers/movieController");

const router = express.Router();

router.get("/", optionalAuth, getMovies);
router.post("/sync", async (_req, res) => {
  const count = await syncMoviesFromArchive();
  res.json({ message: `Synced ${count} movies from Internet Archive` });
});
router.get("/:id", optionalAuth, getMovie);
router.post("/:id/watch", protect, markWatched);
router.post("/:id/rate", protect, rateMovie);

module.exports = router;
