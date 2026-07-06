export default function Features() {
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-xl font-bold">📸 Upload Receipts</h3>

        <p className="mt-3 text-slate-400">
          Save photos and PDFs in one organized place.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-xl font-bold">📊 Track Expenses</h3>

        <p className="mt-3 text-slate-400">
          Organize every purchase with categories and tags.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-xl font-bold">🤖 AI Scanning</h3>

        <p className="mt-3 text-slate-400">
          Automatically extract totals, vendors, taxes, and dates.
        </p>
      </div>
    </section>
  );
}