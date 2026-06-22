import { Play } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import MovieRow from "../components/MovieRow";
import Navbar from "../components/Navbar";
import fallbackMovies from "../data/fallbackMovies";

export default function Home() {
  const [data, setData] = useState({ recommended: [], trending: [], continueWatching: [], allMovies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadMovies = async () => {
      const response = await api.get("/movies");
      setData(response.data);
      setLoading(false);
    };

    loadMovies().catch(() => {
      setData({
        recommended: fallbackMovies,
        trending: fallbackMovies,
        continueWatching: [],
        allMovies: fallbackMovies
      });
      setError("");
      setLoading(false);
    });
  }, []);

  const hero = data.recommended[0] || data.trending[0];
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return [];
    return data.allMovies.filter((movie) => movie.title?.toLowerCase().includes(search));
  }, [data.allMovies, query]);

  return (
    <main className="min-h-screen bg-ink">
      <Navbar query={query} setQuery={setQuery} />
      {loading && (
        <section className="grid min-h-screen place-items-center px-5 pt-24 text-zinc-400">
          Loading movies...
        </section>
      )}
      {!loading && error && (
        <section className="grid min-h-screen place-items-center px-5 pt-24 text-center">
          <div>
            <h1 className="text-4xl font-black text-netflix">StreamFlix</h1>
            <p className="mt-4 max-w-md text-zinc-300">{error}</p>
          </div>
        </section>
      )}
      {!loading && !error && !hero && (
        <section className="grid min-h-screen place-items-center px-5 pt-24 text-center">
          <div>
            <h1 className="text-4xl font-black text-netflix">StreamFlix</h1>
            <p className="mt-4 max-w-md text-zinc-300">No movies are available yet. Try syncing movies again.</p>
          </div>
        </section>
      )}
      {!loading && !error && hero && (
        <section id="home" className="relative min-h-[76vh] scroll-mt-24 px-5 pb-16 pt-36 sm:px-10">
          <div className="absolute inset-0">
            <img src={hero.posterUrl} alt="" className="h-full w-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-ink to-transparent" />
          </div>
          <div className="relative max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase text-netflix">Recommended for you</p>
            <h1 className="text-4xl font-black sm:text-6xl">{hero.title}</h1>
            <p className="mt-5 line-clamp-4 max-w-xl text-base leading-7 text-zinc-200">{hero.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={`/movies/${hero._id}`}
                className="inline-flex items-center gap-2 rounded bg-white px-6 py-3 font-bold text-black hover:bg-zinc-200"
              >
                <Play size={20} fill="currentColor" />
                Play
              </Link>
              <span className="rounded bg-zinc-900/80 px-4 py-3 text-zinc-200 ring-1 ring-white/10">
                Rating {(hero.averageRating || 0).toFixed(1)} / 5
              </span>
            </div>
          </div>
        </section>
      )}

      {query ? (
        <MovieRow title={`Search results for "${query}"`} movies={filtered} />
      ) : (
        <>
          <div id="recommended" className="scroll-mt-24">
            <MovieRow title="Because of your watch history" movies={data.recommended} />
          </div>
          <MovieRow title="Continue Watching" movies={data.continueWatching} />
          <MovieRow title="High Rated and Popular" movies={data.trending} />
          <div id="movies" className="scroll-mt-24">
            <MovieRow title="All Movies" movies={data.allMovies} />
          </div>
        </>
      )}
    </main>
  );
}
