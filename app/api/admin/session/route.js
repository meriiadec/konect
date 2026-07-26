import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyAdminSessionValue } from "../../../../lib/adminAuth";

export const runtime = "nodejs";


function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL est manquante dans Vercel.");
  }

  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY est manquante dans Vercel. Ajoute la clé service_role de Supabase puis redéploie.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}


export async function GET(request) {
  const session = request.cookies.get(COOKIE_NAME)?.value;

  if (!verifyAdminSessionValue(session)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  let supabase;

  try {
    supabase = createServerSupabaseClient();
  } catch (error) {
    return NextResponse.json(
      { authenticated: true, message: error.message },
      { status: 500 },
    );
  }

  const [commercantsResult, operateursResult, produitsResult] = await Promise.all([
    supabase.from("commercants").select("*").order("created_at", { ascending: false }),
    supabase.from("operateurs").select("*").order("created_at", { ascending: false }),
    supabase.from("produits").select("*").order("created_at", { ascending: false }),
  ]);

  const error = commercantsResult.error || operateursResult.error || produitsResult.error;

  if (error) {
    return NextResponse.json(
      { authenticated: true, message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    authenticated: true,
    commercants: commercantsResult.data || [],
    operateurs: operateursResult.data || [],
    produits: produitsResult.data || [],
  });
}
