"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignupForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

const emptyForm: SignupForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);

  function updateField(field: keyof SignupForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    sessionStorage.setItem(
      "receiptr_pending_account",
      JSON.stringify({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      })
    );

    router.push("/pricing");
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

      <section className="mx-auto mt-16 grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
            Start your subscription
          </p>

          <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Create your Receiptr account.
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-gray-600">
            Enter your details, choose the Receiptr Pro subscription, then check
            your email for the secure sign-in setup link after payment.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["AI scanning", "Receipt storage", "CSV exports"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4 font-semibold"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold">Account details</h2>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full name"
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none focus:border-violet-500"
              required
            />

            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none focus:border-violet-500"
              required
            />

            <input
              type="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none focus:border-violet-500"
              required
            />

            <textarea
              placeholder="Billing address"
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              className="min-h-28 w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none focus:border-violet-500"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-[#6D5EF5] p-4 font-semibold text-white transition hover:bg-[#5B4CF0]"
          >
            Continue to Subscription
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already subscribed?{" "}
            <Link href="/login" className="font-semibold text-violet-600">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
