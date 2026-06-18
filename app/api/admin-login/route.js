import { NextResponse } from "next/server";
import { COOKIE_NAME, createAdminSessionValue, getAdminCookieOptions } from "../../../lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request) {
  const { password } = await request.json();
  const motDePasseCorrect = process.env.ADMIN_PASSWORD;

  if (!motDePasseCorrect) {
    return NextResponse.json(
      { success: false, message: "Configuration admin manquante." },
      { status: 500 },
    );
  }

  if (password !== motDePasseCorrect) {
    return NextResponse.json(
      { success: false, message: "Mot de passe incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, createAdminSessionValue(), getAdminCookieOptions());
  return response;
}
