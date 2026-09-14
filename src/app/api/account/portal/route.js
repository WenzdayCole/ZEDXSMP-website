import { NextResponse } from "next/server";
import { getSession } from "@/lib/web-session";
import { checkoutOrigin, getStripe } from "@/lib/stripe";
import { findManageablePayerCustomer } from "@/lib/stripe-billing";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session?.player) {
    return NextResponse.json({ error: "Log in first." }, { status: 401 });
  }

  try {
    const stripe = getStripe();
    const customer = await findManageablePayerCustomer(stripe, session.player);
    return NextResponse.json({ canManage: Boolean(customer) });
  } catch (err) {
    console.error("billing status error:", err);
    return NextResponse.json({ canManage: false });
  }
}

export async function POST(req) {
  const session = await getSession();
  if (!session?.player) {
    return NextResponse.json({ error: "Log in first." }, { status: 401 });
  }

  try {
    const stripe = getStripe();
    const customer = await findManageablePayerCustomer(stripe, session.player);

    if (!customer) {
      return NextResponse.json(
        {
          error:
            "No monthly membership on this login. One-month ranks expire in-game, and gifted ranks are cancelled by the person who paid.",
        },
        { status: 404 },
      );
    }

    const origin = checkoutOrigin(req);
    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/account`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error("portal error:", err);
    return NextResponse.json(
      { error: "Could not open billing portal." },
      { status: 500 },
    );
  }
}
