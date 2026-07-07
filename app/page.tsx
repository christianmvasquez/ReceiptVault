import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Receiptr
        </h1>

        <Link
          href="/login"
          className="rounded-xl bg-[#6D5EF5] px-6 py-3 font-medium text-white transition hover:bg-[#5B4CF0]"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-8 pt-20 pb-16 text-center">

        <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
          AI-Powered Receipt Management
        </span>

        <h2 className="mt-8 text-6xl font-extrabold leading-tight tracking-tight">
          Track receipts.
          <br />
          Stay organized.
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-gray-600">
          Receiptr automatically stores, categorizes, and organizes your
          receipts so you always know where your money goes.
        </p>

        <div className="mt-12 flex justify-center gap-5">

          <Link
            href="/login"
            className="rounded-xl bg-[#6D5EF5] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#5B4CF0]"
          >
            Get Started Free
          </Link>

          <button className="rounded-xl border border-gray-300 px-8 py-4 text-lg font-semibold hover:bg-gray-50">
            See Demo
          </button>

        </div>

      </section>

      {/* Dashboard Preview */}

      <section className="mx-auto max-w-6xl px-8">

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-xl">

          <div className="flex items-center gap-2 border-b bg-white px-6 py-4">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
          </div>

          <div className="flex h-[420px] items-center justify-center text-gray-400 text-xl">
            Dashboard Preview Coming Soon
          </div>

        </div>

      </section>

      {/* Features */}

      <section className="mx-auto mt-24 grid max-w-6xl gap-8 px-8 pb-24 md:grid-cols-3">

        <div className="rounded-3xl border border-gray-200 p-8 transition hover:-translate-y-2 hover:shadow-xl">

          <h3 className="text-2xl font-bold">
            Upload Receipts
          </h3>

          <p className="mt-4 leading-7 text-gray-600">
            Drag and drop receipts from your phone or computer and let AI do the rest.
          </p>

        </div>

        <div className="rounded-3xl border border-gray-200 p-8 transition hover:-translate-y-2 hover:shadow-xl">

          <h3 className="text-2xl font-bold">
            Smart Categorization
          </h3>

          <p className="mt-4 leading-7 text-gray-600">
            Automatically organize purchases into categories for taxes, budgeting, and reporting.
          </p>

        </div>

        <div className="rounded-3xl border border-gray-200 p-8 transition hover:-translate-y-2 hover:shadow-xl">

          <h3 className="text-2xl font-bold">
            Powerful Reports
          </h3>

          <p className="mt-4 leading-7 text-gray-600">
            Export CSVs, monitor spending trends, and quickly find any receipt in seconds.
          </p>

        </div>

      </section>

    </main>
  );
}