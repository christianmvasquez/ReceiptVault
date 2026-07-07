"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/pricing";
  }

  async function handleSignUp() {
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created. Check your email, then sign in.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome to Receiptr
        </h1>

        <p className="mt-3 text-gray-500">
          Create an account or sign in to continue.
        </p>

        <form onSubmit={handleSignIn} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none focus:border-violet-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none focus:border-violet-500"
            required
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-[#6D5EF5] p-4 font-semibold text-white hover:bg-[#5B4CF0]"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={handleSignUp}
            className="w-full rounded-xl border border-gray-300 p-4 font-semibold text-gray-900 hover:bg-gray-50"
          >
            Create Account
          </button>
        </form>

        {message && (
          <p className="mt-6 rounded-xl bg-gray-100 p-3 text-center text-sm text-gray-700">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}