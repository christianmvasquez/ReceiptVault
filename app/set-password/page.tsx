"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SetPasswordPage() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-gray-900">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold text-violet-600">
          Receiptr account
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Set your password.
        </h1>

        <p className="mt-3 leading-7 text-gray-500">
          Create the password you will use when signing in to Receiptr.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none focus:border-violet-500"
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none focus:border-violet-500"
            required
          />

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-xl bg-[#6D5EF5] p-4 font-semibold text-white hover:bg-[#5B4CF0] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Save Password"}
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
