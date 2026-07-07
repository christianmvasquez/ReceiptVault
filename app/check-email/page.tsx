import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-gray-900">
      <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <BrandLogo className="mx-auto h-16 w-auto" />

        <h1 className="mt-8 text-5xl font-bold tracking-tight">
          Check your email.
        </h1>

        <p className="mt-5 leading-7 text-gray-500">
          Your subscriber account is being created. Use the secure email
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
