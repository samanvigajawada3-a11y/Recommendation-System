import React from "react";
import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies }) {
  if (!movies?.length) return null;

  return (
    <section className="px-5 py-5 sm:px-10">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-3">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
