"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsSigningIn(true);
    setMessage("Signing in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsSigningIn(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome to Receiptr
        </h1>

        <p className="mt-3 text-gray-500">
          Sign in after your subscription is active.
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
            disabled={isSigningIn}
            className="w-full rounded-xl bg-[#6D5EF5] p-4 font-semibold text-white hover:bg-[#5B4CF0] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSigningIn ? "Signing In..." : "Sign In"}
          </button>

          <Link
            href="/signup"
            className="block w-full rounded-xl border border-gray-300 p-4 text-center font-semibold text-gray-900 hover:bg-gray-50"
          >
            Create Account
          </Link>
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
