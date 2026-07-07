import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-gray-900">
      <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold text-violet-600">
          Payment received
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight">
          Check your email.
        </h1>

        <p className="mt-5 leading-7 text-gray-500">
          Receiptr is creating your subscriber account. Use the secure email
          link from Supabase to set or reset your password, then sign in.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-xl bg-[#6D5EF5] px-6 py-4 font-semibold text-white hover:bg-[#5B4CF0]"
          >
            Go to Sign In
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-gray-300 px-6 py-4 font-semibold hover:bg-gray-50"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
