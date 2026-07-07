import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type PendingAccount = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
};

function cleanAccount(account: PendingAccount | null) {
  if (!account) return null;

  const fullName = account.fullName?.trim() || "";
  const email = account.email?.trim().toLowerCase() || "";
  const phone = account.phone?.trim() || "";
  const address = account.address?.trim() || "";

  if (!fullName || !email || !phone || !address) {
    return null;
  }

  return { fullName, email, phone, address };
}

export async function POST(request: Request) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const body = (await request.json().catch(() => ({}))) as {
      account?: PendingAccount;
    };
    const pendingAccount = cleanAccount(body.account || null);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !pendingAccount) {
      return NextResponse.json(
        { error: "Create an account before subscribing." },
        { status: 400 }
      );
    }

    const customerEmail = pendingAccount?.email || user?.email;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      client_reference_id: user?.id || pendingAccount?.email,
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: {
        mode: pendingAccount ? "new_account" : "existing_user",
        user_id: user?.id || "",
        full_name: pendingAccount?.fullName || user?.user_metadata?.full_name || "",
        email: customerEmail || "",
        phone: pendingAccount?.phone || user?.user_metadata?.phone || "",
        address: pendingAccount?.address || user?.user_metadata?.address || "",
      },
      subscription_data: {
        metadata: {
          user_id: user?.id || "",
          email: customerEmail || "",
        },
      },
      success_url: pendingAccount
        ? `${siteUrl}/check-email?session_id={CHECKOUT_SESSION_ID}`
        : `${siteUrl}/dashboard?success=true`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Stripe error";

    console.error("Stripe checkout error:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
