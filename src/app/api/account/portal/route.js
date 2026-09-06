import { NextResponse } from "next/server";
import { getSession } from "@/lib/web-session";
import { checkoutOrigin, getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const session = await getSession();
  if (!session?.player) {
    return NextResponse.json({ error: "Log in first." }, { status: 401 });
  }

  try {
    const stripe = getStripe();
    const player = session.player.replace(/"/g, "");
    const found = await stripe.customers.search({
      query: `metadata["player"]:"${player}"`,
      limit: 1,
    });
    const customerId = found.data[0]?.id;

    if (!customerId) {
      return NextResponse.json(
        {
          error:
            "No Stripe customer linked to this username yet. Buy something first, then manage it here.",
        },
        { status: 404 },
      );
    }

    const origin = checkoutOrigin(req);
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
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
