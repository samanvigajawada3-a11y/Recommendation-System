import { ArrowLeft, Play, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function MovieDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    api.get(`/movies/${id}`).then((response) => setMovie(response.data));
  }, [id]);

  const startWatching = async () => {
    if (!user) return;
    await api.post(`/movies/${id}/watch`);
    setWatching(true);
  };

  const rate = async (rating) => {
    if (!user) return;
    const { data } = await api.post(`/movies/${id}/rate`, { rating });
    setMovie({ ...movie, ...data.movie, userRating: rating });
  };

  if (!movie) {
    return <div className="grid min-h-screen place-items-center bg-ink text-zinc-400">Loading movie...</div>;
  }

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="relative px-5 pb-10 pt-28 sm:px-10">
        <div className="absolute inset-0 h-[62vh]">
          <img src={movie.posterUrl} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink to-transparent" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[320px_1fr]">
          <img src={movie.posterUrl} alt={movie.title} className="hidden aspect-[2/3] w-full rounded object-cover poster-shadow lg:block" />
          <div className="max-w-3xl">
            <Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
              <ArrowLeft size={17} />
              Back
            </Link>
            <h1 className="text-4xl font-black sm:text-6xl">{movie.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
              {movie.year && <span>{movie.year}</span>}
              <span>{(movie.averageRating || 0).toFixed(1)} / 5</span>
              <span>{movie.ratingCount || 0} user ratings</span>
            </div>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200">{movie.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {movie.genres?.slice(0, 6).map((genre) => (
                <span key={genre} className="rounded bg-zinc-800 px-3 py-1 text-xs text-zinc-200">
                  {genre}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {user ? (
                <button
                  onClick={startWatching}
                  className="inline-flex items-center gap-2 rounded bg-white px-6 py-3 font-bold text-black hover:bg-zinc-200"
                  type="button"
                >
                  <Play size={20} fill="currentColor" />
                  Watch
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded bg-white px-6 py-3 font-bold text-black hover:bg-zinc-200"
                >
                  <Play size={20} fill="currentColor" />
                  Login to Watch
                </Link>
              )}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => rate(rating)}
                    className="grid h-10 w-10 place-items-center rounded bg-zinc-900 ring-1 ring-white/10 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!user}
                    title={user ? `Rate ${rating}` : "Login to rate"}
                    type="button"
                  >
                    <Star
                      size={18}
                      className={rating <= (movie.averageRating || 0) ? "fill-netflix text-netflix" : "text-zinc-500"}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {watching && (
          <div className="relative mt-10 overflow-hidden rounded bg-black ring-1 ring-white/10">
            <iframe
              title={movie.title}
              src={movie.watchUrl}
              className="aspect-video w-full"
              allowFullScreen
            />
          </div>
        )}
      </section>
    </main>
  );
}
