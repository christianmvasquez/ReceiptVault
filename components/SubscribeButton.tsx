"use client";

import { useState } from "react";

type SubscribeButtonProps = {
  className?: string;
  children?: React.ReactNode;
  showMessage?: boolean;
};

export default function SubscribeButton({
  className = "",
  children = "Subscribe Now",
  showMessage = false,
}: SubscribeButtonProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubscribe() {
    setIsLoading(true);
    setMessage("Starting checkout...");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
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
    <div>
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? "Starting..." : children}
      </button>

      {showMessage && message && (
        <p className="mt-5 text-sm text-gray-500">{message}</p>
      )}
    </div>
  );
}
