"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BrandLogo from "@/components/BrandLogo";

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isCheckingLink, setIsCheckingLink] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function prepareSession() {
      const code = searchParams.get("code");
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (code) {
        await supabase.auth.signOut();

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setMessage(error.message);
          return;
        }

        window.history.replaceState({}, "", "/set-password");
      }

      if (!code && accessToken && refreshToken) {
        await supabase.auth.signOut();

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setMessage(error.message);
          setIsCheckingLink(false);
          return;
        }

        window.history.replaceState({}, "", "/set-password");
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMessage(
          "This password link expired or was already used. Open the newest setup email in a private window, or start checkout again."
        );
        setIsCheckingLink(false);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        await supabase.auth.signOut();
        setMessage(
          "This browser had an old deleted-user session saved. Open the newest email link again, or try it in a private window."
        );
        setIsCheckingLink(false);
        return;
      }

      setIsReady(true);
      setIsCheckingLink(false);
    }

    prepareSession();
  }, [searchParams, supabase]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-gray-900">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <BrandLogo className="h-16 w-auto" />

        <h1 className="mt-8 text-4xl font-bold tracking-tight">
          Set your password.
        </h1>

        <p className="mt-3 leading-7 text-gray-500">
          Create the password you will use when signing in.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none focus:border-violet-500"
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 outline-none focus:border-violet-500"
            required
          />

          <button
            type="submit"
            disabled={isSaving || !isReady}
            className="w-full rounded-xl bg-[#6D5EF5] p-4 font-semibold text-white hover:bg-[#5B4CF0] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCheckingLink
              ? "Checking Link..."
              : isSaving
                ? "Saving..."
                : "Save Password"}
          </button>
        </form>

        {message && (
          <p className="mt-6 rounded-xl bg-gray-100 p-3 text-center text-sm text-gray-700">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordForm />
    </Suspense>
  );
}
