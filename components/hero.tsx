export default function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-6xl font-extrabold tracking-tight">
        Never Lose Another Receipt
      </h1>

      <p className="mt-6 max-w-2xl text-xl text-slate-300">
        Snap a photo, organize every purchase, and have your receipts ready
        whenever you need them.
      </p>

      <div className="mt-10">
        <a
          href="/login"
          className="rounded-xl bg-blue-500 px-8 py-4 text-lg font-semibold transition hover:bg-blue-600"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}