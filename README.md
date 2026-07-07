# Receiptr

Receiptr is a subscriber-only receipt management app built with Next.js,
Supabase, Stripe Checkout, and OpenAI receipt scanning.

## User Flow

1. A new visitor clicks **Subscribe Now** on the home page.
2. They enter name, email, phone, and address on `/signup`.
3. They review the plan on `/pricing` and pay with Stripe Checkout.
4. Stripe calls `/api/stripe-webhook`.
5. The webhook creates or updates the Supabase user, marks them subscribed, and
   sends a secure Supabase invite email so the customer can set a password.
6. The customer signs in at `/login` and gets access to `/dashboard`.

Existing subscribers can use **Sign In** from the home page.

## Local Development

```bash
npm install
npm run dev
```

If file watching is noisy on macOS, run:

```bash
npx next dev --webpack -H 127.0.0.1 -p 3000
```

## Required Environment Variables

Add these in `.env.local` and in Vercel Project Settings:

```env
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

OPENAI_API_KEY=sk_xxx
```

Never expose `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, or `OPENAI_API_KEY` in client-side code.

## Stripe Webhook

In Stripe Dashboard, create a webhook endpoint:

```txt
https://your-vercel-domain.vercel.app/api/stripe-webhook
```

Subscribe it to this event:

```txt
checkout.session.completed
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET` in Vercel.

## Supabase Notes

The app expects Supabase Auth to be enabled. Customers receive an invite email
after successful payment and use that email to set their password.

The dashboard expects a `receipts` table and `receipts` storage bucket matching
the existing receipt components and Supabase queries.

## Deploying to Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add all required environment variables.
4. Deploy.
5. Add the Stripe webhook URL after the first deployment.
6. Update `NEXT_PUBLIC_SITE_URL` to the final live Vercel URL and redeploy.
