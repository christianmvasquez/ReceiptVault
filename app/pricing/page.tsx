"use client";

import { useState } from "react";

export default function PricingPage() {
  const [message, setMessage] = useState("");

  async function handleSubscribe() {
    setMessage("");

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      setMessage("Unable to start checkout.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-gray-900">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold text-violet-600">
          Receiptr Pro
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight">
          Start organizing your receipts.
        </h1>

        <p className="mt-5 text-gray-500">
          Unlock receipt storage, expense tracking, AI scanning, and reports.
        </p>

        <div className="mt-8 rounded-2xl bg-gray-50 p-6">
          <p className="text-4xl font-bold">$9.99</p>
          <p className="mt-1 text-gray-500">per month</p>
        </div>

        <button
          onClick={handleSubscribe}
          className="mt-8 w-full rounded-xl bg-[#6D5EF5] p-4 font-semibold text-white hover:bg-[#5B4CF0]"
        >
          Subscribe Now
        </button>

        {message && (
          <p className="mt-5 text-sm text-gray-500">{message}</p>
        )}
      </div>
    </main>
  );
}