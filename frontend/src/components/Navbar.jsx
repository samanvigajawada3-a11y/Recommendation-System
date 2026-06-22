import React from "react";
import { LogOut, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ query, setQuery }) {
  const { user, logout } = useAuth();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-black via-black/80 to-transparent">
      <div className="flex h-20 items-center gap-6 px-5 sm:px-10">
        <div className="text-2xl font-black uppercase tracking-normal text-netflix">StreamFlix</div>
        <nav className="hidden gap-5 text-sm text-zinc-200 md:flex">
          <button className="hover:text-white" onClick={() => scrollToSection("home")} type="button">
            Home
          </button>
          <button className="hover:text-white" onClick={() => scrollToSection("movies")} type="button">
            Movies
          </button>
          <button className="hover:text-white" onClick={() => scrollToSection("recommended")} type="button">
            Recommend
          </button>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {setQuery && (
            <label className="flex items-center gap-2 rounded bg-zinc-900/80 px-3 py-2 ring-1 ring-white/10">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-44 bg-transparent text-sm outline-none placeholder:text-zinc-500"
                placeholder="Search"
              />
            </label>
          )}
          {user ? (
            <>
              <span className="hidden text-sm text-zinc-300 sm:inline">{user.name}</span>
              <button
                onClick={logout}
                className="grid h-10 w-10 place-items-center rounded bg-zinc-900/80 text-zinc-100 ring-1 ring-white/10 hover:bg-zinc-800"
                title="Logout"
                type="button"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link className="rounded bg-zinc-900/80 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-zinc-800" to="/login">
                Login
              </Link>
              <Link className="rounded bg-netflix px-4 py-2 text-sm font-semibold hover:bg-red-700" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
