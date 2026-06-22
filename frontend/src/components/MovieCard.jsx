import React from "react";
import { Play, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group block w-40 shrink-0 sm:w-48"
      title={movie.title}
    >
      <div className="aspect-[2/3] overflow-hidden rounded bg-zinc-900 poster-shadow">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="line-clamp-1 text-sm font-semibold text-white">{movie.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
            <Star size={13} className="fill-netflix text-netflix" />
            {(movie.averageRating || 0).toFixed(1)} / 5
          </p>
        </div>
        <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-black opacity-0 transition group-hover:opacity-100">
          <Play size={14} fill="currentColor" />
        </span>
      </div>
    </Link>
  );
}
