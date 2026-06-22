const Movie = require("../models/Movie");
const Interaction = require("../models/Interaction");
const { fetchArchiveMovies } = require("../services/archiveService");

const syncMoviesFromArchive = async () => {
  const movies = await fetchArchiveMovies();

  await Promise.all(
    movies.map((movie) =>
      Movie.findOneAndUpdate({ archiveId: movie.archiveId }, movie, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
    )
  );

  return movies.length;
};

const ensureMovies = async () => {
  const count = await Movie.countDocuments();
  if (count < 12) {
    await syncMoviesFromArchive();
  }
};

const getMovies = async (req, res) => {
  await ensureMovies();

  const [movies, interactions] = await Promise.all([
    Movie.find().sort({ averageRating: -1, views: -1 }).limit(80),
    req.user ? Interaction.find({ user: req.user._id }) : []
  ]);

  const interactionMap = new Map(interactions.map((item) => [String(item.movie), item]));
  const personalizedMovies = movies.map((movie) => {
    const interaction = interactionMap.get(String(movie._id));
    return {
      ...movie.toObject(),
      userRating: interaction?.rating || null,
      watchedAt: interaction?.watchedAt || null
    };
  });

  const watchedGenreSet = new Set();
  personalizedMovies.forEach((movie) => {
    if (movie.watchedAt) {
      movie.genres.forEach((genre) => watchedGenreSet.add(genre));
    }
  });

  const recommended = personalizedMovies
    .filter((movie) => !movie.watchedAt)
    .map((movie) => {
      const genreScore = movie.genres.filter((genre) => watchedGenreSet.has(genre)).length;
      const ratingScore = movie.averageRating || 0;
      const popularityScore = Math.min(movie.views / 50, 1);
      return { movie, score: genreScore * 2 + ratingScore + popularityScore };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.movie);

  res.json({
    recommended,
    trending: personalizedMovies.slice(0, 24),
    continueWatching: personalizedMovies.filter((movie) => movie.watchedAt).slice(0, 16),
    allMovies: personalizedMovies
  });
};

const getMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const interaction = req.user
    ? await Interaction.findOne({ user: req.user._id, movie: movie._id })
    : null;

  res.json({
    ...movie.toObject(),
    userRating: interaction?.rating || null,
    watchedAt: interaction?.watchedAt || null
  });
};

const markWatched = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const interaction = await Interaction.findOneAndUpdate(
    { user: req.user._id, movie: movie._id },
    { watchedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  movie.views += 1;
  await movie.save();

  res.json({ message: "Watch history updated", interaction });
};

const rateMovie = async (req, res) => {
  const rating = Number(req.body.rating);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be a whole number from 1 to 5" });
  }

  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  await Interaction.findOneAndUpdate(
    { user: req.user._id, movie: movie._id },
    { rating },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const aggregate = await Interaction.aggregate([
    { $match: { movie: movie._id, rating: { $gte: 1, $lte: 5 } } },
    { $group: { _id: "$movie", averageRating: { $avg: "$rating" }, ratingCount: { $sum: 1 } } }
  ]);

  movie.averageRating = aggregate[0] ? Number(aggregate[0].averageRating.toFixed(1)) : 0;
  movie.ratingCount = aggregate[0]?.ratingCount || 0;
  await movie.save();

  res.json({ message: "Rating saved", movie });
};

module.exports = {
  getMovies,
  getMovie,
  markWatched,
  rateMovie,
  syncMoviesFromArchive
};
