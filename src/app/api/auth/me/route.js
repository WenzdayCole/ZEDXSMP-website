import { NextResponse } from "next/server";
import { getSession } from "@/lib/web-session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ loggedIn: false });
  return NextResponse.json({
    loggedIn: true,
    player: session.player,
    uuid: session.uuid || null,
    email: session.email || null,
  });
}
