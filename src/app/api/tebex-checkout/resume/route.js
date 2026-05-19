import { NextResponse } from "next/server";
import { resumeTebexCheckoutSession } from "@/lib/tebex";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { basketIdent } = await req.json();

    if (!basketIdent) {
      return NextResponse.json(
        { error: "Missing basket after login." },
        { status: 400 },
      );
    }

    const result = await resumeTebexCheckoutSession({ basketIdent });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 500 },
      );
    }

    return NextResponse.json({
      url: result.url,
      ident: result.ident || basketIdent,
    });
  } catch (error) {
    console.error("[tebex-checkout/resume]", error);
    return NextResponse.json(
      { error: "Internal server error while resuming checkout." },
      { status: 500 },
    );
  }
}
