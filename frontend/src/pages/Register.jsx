import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register");
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3b0608,#050505_46%)] px-5 py-8">
      <div className="mb-16 text-3xl font-black uppercase text-netflix">StreamFlix</div>
      <form onSubmit={submit} className="mx-auto max-w-md rounded bg-black/75 p-8 ring-1 ring-white/10">
        <h1 className="mb-6 text-3xl font-bold">Create Account</h1>
        {error && <p className="mb-4 rounded bg-netflix/20 px-3 py-2 text-sm text-red-100">{error}</p>}
        <input
          placeholder="Name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          className="mb-4 w-full rounded bg-zinc-800 px-4 py-3 outline-none ring-netflix focus:ring-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="mb-4 w-full rounded bg-zinc-800 px-4 py-3 outline-none ring-netflix focus:ring-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          className="mb-6 w-full rounded bg-zinc-800 px-4 py-3 outline-none ring-netflix focus:ring-2"
        />
        <button className="w-full rounded bg-netflix py-3 font-bold hover:bg-red-700" type="submit">
          Register
        </button>
        <p className="mt-6 text-zinc-400">
          Already registered?{" "}
          <Link className="text-white hover:underline" to="/login">
            Sign in.
          </Link>
        </p>
      </form>
    </main>
  );
}
