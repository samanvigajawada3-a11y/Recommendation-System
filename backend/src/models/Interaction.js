const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },
    watchedAt: {
      type: Date
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  { timestamps: true }
);

interactionSchema.index({ user: 1, movie: 1 }, { unique: true });

module.exports = mongoose.model("Interaction", interactionSchema);
