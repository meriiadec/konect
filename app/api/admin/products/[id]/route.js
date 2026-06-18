import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyAdminSessionValue } from "../../../../../lib/adminAuth";

export const runtime = "nodejs";

const statutsAutorises = new Set(["pending", "published", "rejected"]);

function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Configuration Supabase manquante.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function PATCH(request, { params }) {
  const session = request.cookies.get(COOKIE_NAME)?.value;

  if (!verifyAdminSessionValue(session)) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  const { statut } = await request.json();

  if (!statutsAutorises.has(statut)) {
    return NextResponse.json({ message: "Statut invalide." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("produits")
    .update({ statut })
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ produit: data });
}
