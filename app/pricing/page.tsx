"use client";

import Link from "next/link";
import { useState } from "react";

type PendingAccount = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

export default function PricingPage() {
  const [account] = useState<PendingAccount | null>(() => {
    if (typeof window === "undefined") return null;

    const savedAccount = sessionStorage.getItem("receiptr_pending_account");

    if (!savedAccount) return null;

    try {
      return JSON.parse(savedAccount) as PendingAccount;
    } catch {
      sessionStorage.removeItem("receiptr_pending_account");
      return null;
    }
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout() {
    setIsLoading(true);
    setMessage("Starting secure checkout...");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Checkout failed.");
        setIsLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setMessage("No checkout URL returned.");
    } catch {
      setMessage("Something went wrong starting checkout.");
    }

    setIsLoading(false);
  }

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-gray-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-3xl font-bold tracking-tight">
          Receiptr
        </Link>

        <Link
          href="/login"
          className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50"
        >
          Sign In
        </Link>
      </nav>

      <section className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold text-violet-600">
            Receiptr Pro
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight">
            Unlock the full receipt dashboard.
          </h1>

          <p className="mt-5 leading-7 text-gray-500">
            Subscribe to store receipts, scan receipt images, export CSVs, and
            keep spending organized in one dashboard.
          </p>

          <div className="mt-8 rounded-2xl bg-gray-50 p-6">
            <p className="text-4xl font-bold">$9.99</p>
            <p className="mt-1 text-gray-500">per month</p>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={isLoading}
            className="mt-8 w-full rounded-xl bg-[#6D5EF5] p-4 font-semibold text-white hover:bg-[#5B4CF0] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Starting..." : "Pay and Create Account"}
          </button>

          {message && (
            <p className="mt-5 rounded-xl bg-gray-100 p-3 text-center text-sm text-gray-700">
              {message}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8">
          <h2 className="text-2xl font-bold">Subscription setup</h2>

          {account ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm font-semibold text-gray-500">Name</p>
                <p className="mt-1 font-semibold">{account.fullName}</p>
              </div>

              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm font-semibold text-gray-500">Email</p>
                <p className="mt-1 font-semibold">{account.email}</p>
              </div>

              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm font-semibold text-gray-500">
                  What happens next
                </p>
                <p className="mt-2 leading-7 text-gray-600">
                  After payment, Receiptr sends a secure email so you can set
                  your password and sign in to the dashboard.
                </p>
              </div>

              <Link
                href="/signup"
                className="inline-flex font-semibold text-violet-600"
              >
                Edit account details
              </Link>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-white p-5">
              <p className="leading-7 text-gray-600">
                New customers should create an account before paying so the
                subscription can be connected to the right email address.
              </p>

              <Link
                href="/signup"
                className="mt-5 inline-flex rounded-xl bg-[#6D5EF5] px-5 py-3 font-semibold text-white hover:bg-[#5B4CF0]"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
