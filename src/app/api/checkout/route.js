import { NextResponse } from "next/server";
import { isValidMinecraftUsernameFormat } from "@/lib/minecraft-username";
import { getProduct, validateCartItems } from "@/lib/store-products";
import { checkoutOrigin, getStripe } from "@/lib/stripe";
import { getSession } from "@/lib/web-session";

export async function POST(req) {
  try {
    const body = await req.json();
    const session = await getSession();
    const player = String(body.player || session?.player || "").trim();
    const edition = String(body.edition || "java").toLowerCase();
    const items = Array.isArray(body.items) ? body.items : [];
    const email = String(body.email || session?.email || "").trim().toLowerCase();

    if (edition !== "java" && edition !== "bedrock") {
      return NextResponse.json({ error: "Choose Java or Bedrock." }, { status: 400 });
    }
    if (!isValidMinecraftUsernameFormat(player)) {
      return NextResponse.json(
        { error: "Enter a valid in-game username." },
        { status: 400 },
      );
    }

    const cartError = validateCartItems(items);
    if (cartError) {
      return NextResponse.json({ error: cartError }, { status: 400 });
    }

    const lines = items.map((item) => ({
      product: getProduct(item.product),
      quantity: Number(item.quantity) || 1,
    }));

    const hasSub = lines.some((line) => line.product.mode === "subscription");
    const mode = hasSub ? "subscription" : "payment";
    const origin = checkoutOrigin(req);

    const stripeLines = lines.map(({ product, quantity }) => {
      const priceData = {
        currency: "gbp",
        unit_amount: product.amountPence,
        product_data: {
          name: product.name,
          metadata: { product: product.id },
        },
      };
      if (product.mode === "subscription") {
        priceData.recurring = { interval: product.interval || "month" };
      }
      return { price_data: priceData, quantity };
    });

    const rank = lines.find((line) => line.product.type === "rank");
    const cart = JSON.stringify(
      lines.map(({ product, quantity }) => ({
        product: product.id,
        quantity,
      })),
    ).slice(0, 500);

    const metadata = {
      player,
      edition,
      product: rank?.product.id || lines[0].product.id,
      cart,
    };

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode,
      line_items: stripeLines,
      automatic_payment_methods: { enabled: true },
      success_url: `${origin}/ranks?checkout=success`,
      cancel_url: `${origin}/ranks?checkout=cancelled`,
      metadata,
      client_reference_id: player,
      ...(email.includes("@") ? { customer_email: email } : {}),
      ...(mode === "payment" ? { customer_creation: "always" } : {}),
      ...(mode === "subscription"
        ? {
            subscription_data: {
              metadata,
            },
          }
        : {}),
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Checkout failed." },
      { status: 500 },
    );
  }
}
