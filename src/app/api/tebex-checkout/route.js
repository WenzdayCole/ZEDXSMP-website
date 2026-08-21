import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Tebex checkout is disabled. Use Stripe via /api/checkout." },
    { status: 410 },
  );
}
