import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <BrandLogo className="h-16 w-auto" />

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
          Automatically store, categorize, and organize your
          receipts so you always know where your money goes.
        </p>

        <div className="mt-12 flex justify-center gap-5">

          <Link
            href="/signup"
            className="rounded-xl bg-[#6D5EF5] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#5B4CF0]"
          >
            Subscribe Now
          </Link>

          <Link
            href="/demo"
            className="rounded-xl border border-gray-300 px-8 py-4 text-lg font-semibold hover:bg-gray-50"
          >
            Try Demo
          </Link>

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

          <div className="grid min-h-[420px] gap-5 p-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Recent Receipts</h3>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
                  AI filled
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  ["Whole Foods Market", "Meals", "$87.65"],
                  ["Shell", "Fuel", "$42.31"],
                  ["Amazon Business", "Supplies", "$129.99"],
                  ["Delta Air Lines", "Travel", "$416.20"],
                ].map(([vendor, category, amount]) => (
                  <div
                    key={vendor}
                    className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                  >
                    <div>
                      <p className="font-semibold">{vendor}</p>
                      <p className="text-sm text-gray-500">{category}</p>
                    </div>
                    <p className="font-bold">{amount}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold">Summary</h3>
              <div className="mt-5 grid gap-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Total Spending</p>
                  <p className="mt-1 text-3xl font-bold">$676.15</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Top Category</p>
                  <p className="mt-1 text-3xl font-bold">Travel</p>
                </div>
                <Link
                  href="/demo"
                  className="rounded-xl bg-gray-900 p-3 text-center font-semibold text-white hover:bg-gray-800"
                >
                  Open Demo
                </Link>
              </div>
            </div>
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
