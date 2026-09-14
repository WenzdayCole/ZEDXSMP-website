import { NextResponse } from "next/server";
import {
  applyEditionPrefix,
  ignKey,
  isValidMinecraftUsernameFormat,
} from "@/lib/minecraft-username";
import { getProduct, validateCartItems } from "@/lib/store-products";
import { checkoutOrigin, getStripe } from "@/lib/stripe";
import { getSession } from "@/lib/web-session";
import { clientIp, rateLimit } from "@/lib/ip-rate-limit";

function validEdition(value) {
  return value === "java" || value === "bedrock";
}

export async function POST(req) {
  if (!rateLimit(`checkout:${clientIp(req)}`, { max: 10, windowMs: 60_000 })) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Try again shortly." },
      { status: 429 },
    );
  }
  try {
    const body = await req.json();
    const session = await getSession();
    const edition = String(body.edition || "java").toLowerCase();
    const payerEdition = String(body.payerEdition || edition).toLowerCase();
    const items = Array.isArray(body.items) ? body.items : [];
    const email = String(body.email || session?.email || "").trim().toLowerCase();

    if (!validEdition(edition) || !validEdition(payerEdition)) {
      return NextResponse.json({ error: "Choose Java or Bedrock." }, { status: 400 });
    }

    const recipient = applyEditionPrefix(body.player, edition);
    if (!isValidMinecraftUsernameFormat(recipient)) {
      return NextResponse.json(
        { error: "Enter a valid in-game username." },
        { status: 400 },
      );
    }

    let gift = Boolean(body.gift);
    let payer = applyEditionPrefix(body.payer || "", payerEdition);
    const sessionPlayer = session?.player ? String(session.player).trim() : "";

    if (sessionPlayer && ignKey(sessionPlayer) !== ignKey(recipient)) {
      gift = true;
      payer = sessionPlayer;
    } else if (!gift) {
      payer = recipient;
    }

    if (gift) {
      if (!isValidMinecraftUsernameFormat(payer)) {
        return NextResponse.json(
          { error: "Enter your in-game username so you can manage this gift later." },
          { status: 400 },
        );
      }
      if (ignKey(payer) === ignKey(recipient)) {
        gift = false;
        payer = recipient;
      }
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
      const displayName = gift
        ? `${product.name} — gift for ${recipient}`
        : product.name;
      const priceData = {
        currency: "gbp",
        unit_amount: product.amountPence,
        product_data: {
          name: displayName,
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
      player: recipient,
      payer,
      gift: gift ? "1" : "0",
      edition,
      payer_edition: gift ? payerEdition : edition,
      product: rank?.product.id || lines[0].product.id,
      cart,
    };

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode,
      line_items: stripeLines,
      payment_method_types: ["card"],
      success_url: `${origin}/ranks?checkout=success`,
      cancel_url: `${origin}/ranks?checkout=cancelled`,
      metadata,
      client_reference_id: recipient,
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
