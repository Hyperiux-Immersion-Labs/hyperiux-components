# Hyperiux Monetization Plan

A complete implementation plan for gating 100+ effects behind a subscription paywall, while keeping 10–15 effects permanently free. Both the docs site and the CLI are gated.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack & Requirements](#tech-stack--requirements)
3. [Phase 1 — Tag Effects as Free or Pro](#phase-1--tag-effects-as-free-or-pro)
4. [Phase 2 — Auth & Billing Infrastructure](#phase-2--auth--billing-infrastructure)
5. [Phase 3 — Gate the Docs Site](#phase-3--gate-the-docs-site)
6. [Phase 4 — Gate the CLI](#phase-4--gate-the-cli)
7. [Phase 5 — Protect Pro Effect File Contents](#phase-5--protect-pro-effect-file-contents)
8. [Data Model](#data-model)
9. [Environment Variables](#environment-variables)
10. [Free Tier Strategy](#free-tier-strategy)

---

## Overview

### What gets gated

| Surface | Free users | Pro users |
|---|---|---|
| `/effects` listing page | See all effects (with lock icon on pro) | See all effects |
| `/effects/[slug]` detail page | Full page for free effects. Blurred/locked for pro | Full page for all effects |
| `/effects/[slug]/preview` iframe | Works for free effects only | Works for all effects |
| `npx hyperiux add <effect>` | Installs free effects | Installs all effects with license key |

### What never gets gated
- The `/effects` listing page itself (browsing is always free — discovery drives conversion)
- The CLI commands `init` and `list` (always free)
- Free-tier effect source code

---

## Tech Stack & Requirements

### Services to sign up for

| Service | Purpose | Free tier available |
|---|---|---|
| [Clerk](https://clerk.com) | Authentication (login, sessions, user management) | Yes — generous free tier |
| [Stripe](https://stripe.com) | Subscription billing | Yes — pay per transaction only |
| [Supabase](https://supabase.com) | Database to store user subscription status | Yes — free tier |

### Packages to install in `apps/docs`

```bash
pnpm add @clerk/nextjs stripe @supabase/supabase-js
```

### Packages to install in `packages/cli`

```bash
# No new npm packages needed — uses Node's built-in fetch
```

### What you need to know before starting

- The docs site is a **Next.js App Router** app with **no TypeScript** (all `.js`/`.jsx`)
- Registry effect metadata lives in `registry/effects/<category>/<name>/registry.json`
- The build script at `apps/docs/scripts/build-registry.js` compiles all registry.json files into `apps/docs/public/r/index.json` and `apps/docs/public/r/<name>.json`
- The CLI reads effect files from the public registry JSON at `https://components.hyperiux.com/r`

---

## Phase 1 — Tag Effects as Free or Pro

**Goal:** Mark each effect as `"tier": "free"` or `"tier": "pro"` in its `registry.json`. This is the source of truth for all gating decisions.

### Step 1.1 — Update the registry.json schema

Add a `tier` field to every effect's `registry.json`:

```json
{
  "name": "blur-text",
  "type": "registry:component",
  "title": "Blur Text",
  "description": "...",
  "category": "text",
  "tier": "free",
  "dependencies": [],
  "registryDependencies": [],
  "previewUrl": "/blur-text",
  "order": 1
}
```

Valid values: `"free"` or `"pro"`. Default to `"pro"` if the field is missing (safe fallback).

### Step 1.2 — Pick the free effects

Choose 10–15 effects. Recommended criteria:
- Visually impressive (drives sharing and discovery)
- Cover multiple categories (text, scroll, cursor, webgl — show breadth)
- Not the most complex ones (leave depth behind the paywall)

Set `"tier": "free"` on those. Set `"tier": "pro"` on everything else.

### Step 1.3 — Rebuild the registry

```bash
pnpm build:registry
```

This re-runs `apps/docs/scripts/build-registry.js` and embeds `tier` into all compiled JSON files in `apps/docs/public/r/`. The `tier` field will now be present in both `index.json` and each individual `<name>.json`.

### Step 1.4 — Update the build script to forward the tier field

Open `apps/docs/scripts/build-registry.js`. Find where the effect metadata object is assembled for output. Make sure `tier` is explicitly included:

```js
const effectData = {
  name: meta.name,
  title: meta.title,
  description: meta.description,
  category: meta.category,
  tier: meta.tier ?? 'pro',  // add this line — default to pro if missing
  dependencies: meta.dependencies ?? [],
  // ... rest of fields
}
```

---

## Phase 2 — Auth & Billing Infrastructure

**Goal:** Set up Clerk for login, Stripe for subscriptions, and Supabase to track who has an active subscription.

### Step 2.1 — Set up Clerk

1. Create an account at [clerk.com](https://clerk.com) and create a new application
2. Choose "Email + Password" and optionally Google OAuth
3. Copy your API keys to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/effects
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/effects
```

4. Wrap the root layout in `ClerkProvider`. Edit `apps/docs/src/app/layout.js`:

```jsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" ...>
        <body ...>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
```

5. Create the auth pages. Add these two route files:

`apps/docs/src/app/sign-in/[[...sign-in]]/page.js`:
```jsx
import { SignIn } from '@clerk/nextjs'
export default function SignInPage() {
  return <SignIn />
}
```

`apps/docs/src/app/sign-up/[[...sign-up]]/page.js`:
```jsx
import { SignUp } from '@clerk/nextjs'
export default function SignUpPage() {
  return <SignUp />
}
```

### Step 2.2 — Set up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create a Product called "Hyperiux Pro" with a recurring Price (monthly and/or yearly)
3. Copy the Price ID (looks like `price_1ABC...`) — you'll need it
4. Add to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_PRO_PRICE_ID=price_...
```

5. Create `apps/docs/src/lib/stripe.js`:

```js
import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
```

### Step 2.3 — Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. In the SQL editor, create the subscriptions table:

```sql
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text unique not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'free',           -- 'free' | 'pro'
  status text default 'inactive',     -- 'active' | 'inactive' | 'canceled'
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

3. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

4. Create `apps/docs/src/lib/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
```

5. Create a helper to check subscription status:

`apps/docs/src/lib/subscription.js`:

```js
import { supabase } from './supabase'

export async function getUserPlan(clerkUserId) {
  if (!clerkUserId) return 'free'

  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (!data) return 'free'
  if (data.status !== 'active') return 'free'
  if (data.current_period_end && new Date(data.current_period_end) < new Date()) return 'free'

  return data.plan // 'pro'
}
```

### Step 2.4 — Stripe Checkout API route

Create `apps/docs/src/app/api/checkout/route.js`:

```js
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get or create Stripe customer
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('clerk_user_id', userId)
    .single()

  let customerId = sub?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({ metadata: { clerkUserId: userId } })
    customerId = customer.id
    await supabase.from('subscriptions').upsert({ clerk_user_id: userId, stripe_customer_id: customerId })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/effects?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/effects`,
  })

  return NextResponse.json({ url: session.url })
}
```

### Step 2.5 — Stripe Webhook API route

This is what keeps your DB in sync when Stripe payments succeed, fail, or subscriptions cancel.

Create `apps/docs/src/app/api/webhooks/stripe/route.js`:

```js
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const session = event.data.object

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription)
    const clerkUserId = session.customer_details?.metadata?.clerkUserId
      || (await stripe.customers.retrieve(session.customer)).metadata.clerkUserId

    await supabase.from('subscriptions').upsert({
      clerk_user_id: clerkUserId,
      stripe_customer_id: session.customer,
      stripe_subscription_id: subscription.id,
      plan: 'pro',
      status: 'active',
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  if (event.type === 'customer.subscription.updated') {
    await supabase.from('subscriptions')
      .update({
        status: session.status === 'active' ? 'active' : 'inactive',
        current_period_end: new Date(session.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', session.id)
  }

  if (event.type === 'customer.subscription.deleted') {
    await supabase.from('subscriptions')
      .update({ plan: 'free', status: 'canceled', updated_at: new Date().toISOString() })
      .eq('stripe_subscription_id', session.id)
  }

  return NextResponse.json({ received: true })
}
```

Register this webhook URL in your Stripe dashboard:
`https://your-domain.com/api/webhooks/stripe`

Listen for these events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## Phase 3 — Gate the Docs Site

**Goal:** On `/effects/[slug]`, check if the effect is pro and if the user has an active subscription. Show a blurred upgrade prompt if not.

### Step 3.1 — Make the detail page server-aware

The detail page at `apps/docs/src/app/effects/[slug]/page.js` (or wherever `effect-detail.jsx` is rendered) is already a server component. Add auth + plan check at the top:

```js
import { auth } from '@clerk/nextjs/server'
import { getUserPlan } from '@/lib/subscription'
import { getEffectBySlug } from '@/lib/registry'

export default async function EffectDetailPage({ params }) {
  const { slug } = await params
  const effect = getEffectBySlug(slug)

  const { userId } = await auth()
  const plan = await getUserPlan(userId)

  const isLocked = effect.tier === 'pro' && plan !== 'pro'

  return <EffectDetail effect={effect} isLocked={isLocked} />
}
```

### Step 3.2 — Build the locked state UI

In `effect-detail.jsx`, conditionally render either the full detail view or a locked overlay based on the `isLocked` prop:

```jsx
export function EffectDetail({ effect, isLocked }) {
  if (isLocked) {
    return (
      <div>
        {/* Show the effect title and description freely */}
        <h1>{effect.title}</h1>
        <p>{effect.description}</p>

        {/* Blurred preview with upgrade CTA on top */}
        <div style={{ position: 'relative' }}>
          <div style={{ filter: 'blur(8px)', pointerEvents: 'none' }}>
            {/* Render a fake/placeholder code block */}
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UpgradeCard />
          </div>
        </div>
      </div>
    )
  }

  return <FullEffectDetail effect={effect} />
}
```

### Step 3.3 — Build the UpgradeCard component

Create `apps/docs/src/components/UpgradeCard.jsx`:

```jsx
'use client'

export function UpgradeCard() {
  async function handleUpgrade() {
    const res = await fetch('/api/checkout', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div>
      <h2>Pro Effect</h2>
      <p>Subscribe to Hyperiux Pro to access this effect and 90+ others.</p>
      <button onClick={handleUpgrade}>
        Upgrade to Pro — $X/month
      </button>
    </div>
  )
}
```

### Step 3.4 — Show lock icons on the listing page

In the effects listing page, show a lock icon on pro effect cards. The `index.json` already contains `tier` (after Phase 1). In `EffectCardNew` or `vault-content.jsx`, check `effect.tier === 'pro'` and render a lock badge.

### Step 3.5 — Gate the preview iframe route

The `/effects/[slug]/preview` route renders the fullscreen demo. Add the same auth check there so embedding a pro effect's iframe also requires a subscription.

---

## Phase 4 — Gate the CLI

**Goal:** When a user runs `npx hyperiux add <pro-effect>`, require a license key that maps to an active subscription.

### Step 4.1 — Add a `login` command to the CLI

Add a new command `npx hyperiux login` that:
1. Opens the Hyperiux site in the browser at a `/cli-auth` page
2. The page shows the user their CLI token after they log in
3. The user copies and pastes the token back into the terminal
4. The CLI saves the token to `~/.hyperiux/config.json`

Create `packages/cli/src/commands/login.js`:

```js
import fs from 'fs'
import os from 'os'
import path from 'path'
import prompts from 'prompts'
import chalk from 'chalk'

const CONFIG_DIR = path.join(os.homedir(), '.hyperiux')
const AUTH_FILE = path.join(CONFIG_DIR, 'auth.json')

export async function login() {
  console.log(chalk.cyan('\nOpen this URL in your browser to get your CLI token:'))
  console.log(chalk.white('https://components.hyperiux.com/cli-auth\n'))

  const { token } = await prompts({
    type: 'text',
    name: 'token',
    message: 'Paste your CLI token here:',
  })

  if (!token) {
    console.log(chalk.red('No token provided.'))
    return
  }

  fs.mkdirSync(CONFIG_DIR, { recursive: true })
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ token }, null, 2))
  console.log(chalk.green('Logged in successfully.'))
}

export function getAuthToken() {
  if (!fs.existsSync(AUTH_FILE)) return null
  try {
    const { token } = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'))
    return token
  } catch {
    return null
  }
}
```

Register the command in `packages/cli/src/index.js`:

```js
import { login } from './commands/login.js'

program
  .command('login')
  .description('Log in to Hyperiux to access pro effects')
  .action(login)
```

### Step 4.2 — Create the CLI token API route

When the user visits `/cli-auth` on the docs site (logged in via Clerk), generate a long-lived signed token for them. Store a hashed version in Supabase alongside their `clerk_user_id`.

Create `apps/docs/src/app/api/cli/token/route.js`:

```js
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  await supabase.from('subscriptions')
    .update({ cli_token_hash: tokenHash, updated_at: new Date().toISOString() })
    .eq('clerk_user_id', userId)

  return NextResponse.json({ token })
}
```

Add `cli_token_hash text` column to your Supabase `subscriptions` table:

```sql
alter table subscriptions add column cli_token_hash text;
```

### Step 4.3 — Create the CLI validate API route

The CLI calls this before installing a pro effect. It checks the token is valid and the user has an active pro subscription.

Create `apps/docs/src/app/api/cli/validate/route.js`:

```js
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { token } = await req.json()
  if (!token) return NextResponse.json({ valid: false }, { status: 400 })

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('cli_token_hash', tokenHash)
    .single()

  if (!data || data.status !== 'active' || data.plan !== 'pro') {
    return NextResponse.json({ valid: false, reason: 'No active Pro subscription found.' })
  }

  if (data.current_period_end && new Date(data.current_period_end) < new Date()) {
    return NextResponse.json({ valid: false, reason: 'Subscription has expired.' })
  }

  return NextResponse.json({ valid: true })
}
```

### Step 4.4 — Gate the `add` command

In `packages/cli/src/commands/add.js`, after fetching the effect metadata, check the tier and validate before proceeding:

```js
import { getAuthToken } from './login.js'
import chalk from 'chalk'

// Inside the add() function, after fetching the effect:
if (effect.tier === 'pro') {
  const token = getAuthToken()

  if (!token) {
    console.log(chalk.red('\nThis is a Pro effect.'))
    console.log(chalk.white('Run `npx hyperiux login` to connect your Pro account.\n'))
    process.exit(1)
  }

  const res = await fetch('https://components.hyperiux.com/api/cli/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  const { valid, reason } = await res.json()

  if (!valid) {
    console.log(chalk.red(`\nAccess denied: ${reason}`))
    console.log(chalk.white('Subscribe at https://components.hyperiux.com\n'))
    process.exit(1)
  }
}
```

---

## Phase 5 — Protect Pro Effect File Contents

**Goal:** Right now, all effect file contents are embedded in the public `public/r/<name>.json`. Anyone can read those files directly — no auth needed. This phase removes pro effect code from the public registry and serves it only through an authenticated API.

### Step 5.1 — Strip file contents from pro effects in the build script

In `apps/docs/scripts/build-registry.js`, when writing a pro effect's JSON, omit the `files` array (which contains the actual source code):

```js
const output = {
  ...effectData,
  files: effectData.tier === 'pro'
    ? effectData.files.map(f => ({ ...f, content: undefined })) // strip content
    : effectData.files
}
```

The metadata (name, title, description, dependencies, tier) is still public. Only the `content` field inside each file entry is removed.

### Step 5.2 — Create a protected file-serving API route

Create `apps/docs/src/app/api/effects/[slug]/route.js`:

```js
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'
import { getEffectBySlug } from '@/lib/registry'  // reads the FULL registry from disk, not public/r/
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { slug } = await params

  // Validate CLI token from Authorization header
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('cli_token_hash', tokenHash)
    .single()

  if (!data || data.status !== 'active' || data.plan !== 'pro') {
    return NextResponse.json({ error: 'Pro subscription required' }, { status: 403 })
  }

  const effect = getEffectBySlug(slug) // full data including file contents
  return NextResponse.json(effect)
}
```

### Step 5.3 — Update the CLI to use the protected route for pro effects

In `packages/cli/src/utils/registry.js`, update `fetchRemoteRegistry` to use the protected endpoint when fetching pro effects:

```js
export async function fetchRegistry(name, options = {}) {
  // ... existing dev/local checks ...

  // Fetch metadata first (public, no auth)
  const metaRes = await fetch(`${REGISTRY_URL}/${name}.json`)
  const meta = await metaRes.json()

  if (meta.tier !== 'pro') {
    return meta // free effect — already has file contents
  }

  // Pro effect — fetch full data from protected endpoint
  const token = getAuthToken()
  const fullRes = await fetch(`https://components.hyperiux.com/api/effects/${name}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!fullRes.ok) {
    throw new Error('Pro subscription required. Run `npx hyperiux login`.')
  }

  return fullRes.json()
}
```

---

## Data Model

### Supabase — `subscriptions` table

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key |
| `clerk_user_id` | text | Unique. Links to Clerk user |
| `stripe_customer_id` | text | Stripe customer ID |
| `stripe_subscription_id` | text | Active Stripe subscription ID |
| `plan` | text | `'free'` or `'pro'` |
| `status` | text | `'active'`, `'inactive'`, `'canceled'` |
| `current_period_end` | timestamptz | When the current billing period ends |
| `cli_token_hash` | text | SHA-256 hash of the user's CLI token |
| `created_at` | timestamptz | Auto-set |
| `updated_at` | timestamptz | Updated on every Stripe webhook |

---

## Environment Variables

Add all of these to `.env.local` (and to Vercel project settings for production):

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/effects
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/effects

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_PRO_PRICE_ID=price_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_APP_URL=https://components.hyperiux.com
```

Also add these to `turbo.json` under the `build` task's `env` array (same as the others already there) to avoid Turborepo cache warnings.

---

## Free Tier Strategy

The free effects should be your **most shareable** ones — the ones that get posted on Twitter, LinkedIn, and dev communities. People need to see the quality ceiling before they'll pay for more.

Suggested criteria for picking free effects:
- One or two from each major category (text, scroll, cursor, webgl, backgrounds)
- Prefer effects with broad appeal over niche/complex ones
- Include at least one Three.js/WebGL effect — these are the most impressive and drive the most curiosity
- Keep the most complex and versatile effects behind the paywall (they have the highest perceived value)

The listing page (`/effects`) should always show all effects including pro ones — with a lock icon. This lets free users browse the full library and feel the pull of what they're missing.
