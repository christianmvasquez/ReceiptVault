import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Receiptr</h1>

        <Link
          href="/login"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Sign In
        </Link>
      </nav>

      <section className="mx-auto max-w-5xl px-8 py-24 text-center">
        <h2 className="text-6xl font-bold tracking-tight">
          Receipt management made simple.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-gray-500">
          Store receipts, track expenses, search purchases, and export reports
          from one clean dashboard.
        </p>

        <div className="mt-10">
          <Link
            href="/login"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-8 pb-24 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-semibold">Upload Receipts</h3>
          <p className="mt-4 text-gray-500">
            Save receipt images in one organized place.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-semibold">Track Expenses</h3>
          <p className="mt-4 text-gray-500">
            Categorize purchases and monitor spending over time.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-semibold">Export Reports</h3>
          <p className="mt-4 text-gray-500">
            Download your receipt data as a CSV whenever you need it.
          </p>
        </div>
      </section>
    </main>
  );
}