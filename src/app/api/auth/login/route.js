import { NextResponse } from "next/server";
import { isValidMinecraftUsernameFormat } from "@/lib/minecraft-username";
import { setSessionCookie } from "@/lib/web-session";
import { verifyPlayerPassword } from "@/lib/zedx-auth";
import { clientIp, rateLimit } from "@/lib/ip-rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!rateLimit(`login:${clientIp(req)}`)) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }
  try {
    const body = await req.json();
    const player = String(body.player || "").trim();
    const password = String(body.password || "");
    const email = String(body.email || "").trim().toLowerCase();

    if (!isValidMinecraftUsernameFormat(player)) {
      return NextResponse.json({ error: "Invalid in-game username." }, { status: 400 });
    }

    const result = await verifyPlayerPassword(player, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    await setSessionCookie({
      player: result.player,
      uuid: result.uuid,
      email: email || null,
    });

    return NextResponse.json({
      ok: true,
      player: result.player,
      uuid: result.uuid,
    });
  } catch (err) {
    console.error("auth login error:", err);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
