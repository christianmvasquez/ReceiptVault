import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function findUserIdByEmail(email: string) {
  const supabase = createAdminClient();
  const normalizedEmail = email.toLowerCase();
  let page = 1;

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) throw error;

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail
    );

    if (match) return match.id;
    if (data.users.length < 1000) return null;

    page += 1;
  }

  return null;
}

async function markSubscribed(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();
  const metadata = session.metadata || {};
  const email = metadata.email || session.customer_details?.email || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const passwordSetupRedirect = `${siteUrl}/auth/callback?next=/set-password`;

  if (!email) {
    throw new Error("Checkout session completed without an email address.");
  }

  const userMetadata = {
    full_name: metadata.full_name || "",
    phone: metadata.phone || "",
    address: metadata.address || "",
    subscribed: true,
    stripe_customer_id:
      typeof session.customer === "string" ? session.customer : "",
    stripe_subscription_id:
      typeof session.subscription === "string" ? session.subscription : "",
  };

  if (metadata.user_id) {
    const { error } = await supabase.auth.admin.updateUserById(
      metadata.user_id,
      {
        user_metadata: userMetadata,
      }
    );

    if (error) throw error;
    return;
  }

  const existingUserId = await findUserIdByEmail(email);

  if (existingUserId) {
    const { error } = await supabase.auth.admin.updateUserById(existingUserId, {
      user_metadata: userMetadata,
      email_confirm: true,
    });

    if (error) throw error;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: passwordSetupRedirect,
      }
    );

    if (resetError) throw resetError;
    return;
  }

  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: userMetadata,
    redirectTo: passwordSetupRedirect,
  });

  if (error) throw error;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook secret." },
      { status: 500 }
    );
  }

  const signature = (await headers()).get("stripe-signature");
  const body = await request.text();

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid Stripe webhook.";

    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await markSubscribed(event.data.object);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed.";

    console.error("Stripe webhook error:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
