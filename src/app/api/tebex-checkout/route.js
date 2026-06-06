import { NextResponse } from "next/server";
import { createTebexCheckoutSession } from "@/lib/tebex";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const packageId = Number(body.packageId);
    const username = body.username;

    if (!packageId || Number.isNaN(packageId)) {
      return NextResponse.json(
        { error: "Missing or invalid packageId." },
        { status: 400 },
      );
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const result = await createTebexCheckoutSession({
      packageId,
      username,
      clientIp,
      returnOrigin: body.returnOrigin,
      returnPath: body.returnPath,
      requestHeaders: req.headers,
    });

    const logPayload = {
      packageId,
      username: username ? `${String(username).slice(0, 3)}***` : null,
      ok: result.ok,
      requiresAuth: result.requiresAuth,
      hasUrl: Boolean(result.url),
      hasIdent: Boolean(result.ident),
      status: result.status,
      error: result.ok ? null : result.error,
    };

    if (result.ok) {
      if (process.env.NODE_ENV === "development") {
        console.info("[tebex-checkout]", logPayload);
      }
    } else {
      console.error("[tebex-checkout]", logPayload);
    }

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error || "Tebex checkout failed.",
          url: result.url || null,
          fallbackUrl: result.fallbackUrl || null,
          ident: result.ident || null,
          requiresAuth: Boolean(result.requiresAuth),
          message: result.message || null,
        },
        { status: result.status || 500 },
      );
    }

    if (!result.url && !result.ident) {
      console.error("[tebex-checkout] ok but missing url/ident", logPayload);
      return NextResponse.json(
        {
          error:
            "Tebex accepted the basket but did not return checkout details. Try again.",
          fallbackUrl: result.fallbackUrl,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      url: result.url || null,
      ident: result.ident || null,
      requiresAuth: Boolean(result.requiresAuth),
      message: result.message,
    });
  } catch (error) {
    console.error("Tebex checkout route error:", error);
    return NextResponse.json(
      { error: "Internal server error while connecting to Tebex." },
      { status: 500 },
    );
  }
}
