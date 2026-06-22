const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    archiveId: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: "No description available."
    },
    posterUrl: {
      type: String,
      default: ""
    },
    watchUrl: {
      type: String,
      required: true
    },
    year: {
      type: String,
      default: ""
    },
    genres: {
      type: [String],
      default: []
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
