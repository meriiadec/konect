"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const MOT_DE_PASSE = "konect2026";

export default function Admin() {
  const [access, setAccess] = useState(false);
  const [mdp, setMdp] = useState("");
  const [commercants, setCommercants] = useState([]);
  const [operateurs, setOperateurs] = useState([]);
  const [onglet, setOnglet] = useState("commercants");

  function handleLogin(e) {
    e.preventDefault();
    if (mdp === MOT_DE_PASSE) {
      setAccess(true);
      chargerDonnees();
    } else {
      alert("Mot de passe incorrect.");
    }
  }

  async function chargerDonnees() {
    const { data: c } = await supabase.from("commercants").select("*").order("created_at", { ascending: false });
    const { data: o } = await supabase.from("operateurs").select("*").order("created_at", { ascending: false });
    setCommercants(c || []);
    setOperateurs(o || []);
  }

  if (!access) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-2 text-orange-500">Admin Konect</h1>
          <p className="text-gray-400 text-sm mb-6">Accès réservé</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={mdp}
              onChange={(e) => setMdp(e.target.value)}
              placeholder="Mot de passe"
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
            <button type="submit" className="bg-orange-500 py-3 rounded-full font-semibold hover:bg-orange-400 transition">
              Entrer
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="px-8 py-6 flex justify-between items-center border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-orange-500">Dashboard Konect</h1>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-400">{commercants.length} commerçants</span>
          <span className="text-gray-400">{operateurs.length} opérateurs</span>
        </div>
      </header>

      <div className="px-8 py-6">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setOnglet("commercants")}
            className={`px-6 py-2 rounded-full font-semibold transition ${onglet === "commercants" ? "bg-orange-500" : "bg-zinc-800 hover:bg-zinc-700"}`}
          >
            Commerçants
          </button>
          <button
            onClick={() => setOnglet("operateurs")}
            className={`px-6 py-2 rounded-full font-semibold transition ${onglet === "operateurs" ? "bg-orange-500" : "bg-zinc-800 hover:bg-zinc-700"}`}
          >
            Opérateurs
          </button>
        </div>

        {onglet === "commercants" && (
          <div className="flex flex-col gap-4">
            {commercants.length === 0 && <p className="text-gray-500">Aucun commerçant inscrit.</p>}
            {commercants.map((c) => (
              <div key={c.id} className="bg-zinc-900 rounded-2xl p-6 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{c.boutique}</h3>
                    <p className="text-gray-400 text-sm">{c.nom}</p>
                  </div>
                  <span className="bg-orange-500 text-xs px-3 py-1 rounded-full">{c.secteur}</span>
                </div>
                <div className="flex gap-6 text-sm text-gray-400 mt-2">
                  <span>📞 {c.telephone}</span>
                  <span>📍 {c.zone}</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1">{new Date(c.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
            ))}
          </div>
        )}

        {onglet === "operateurs" && (
          <div className="flex flex-col gap-4">
            {operateurs.length === 0 && <p className="text-gray-500">Aucun opérateur inscrit.</p>}
            {operateurs.map((o) => (
              <div key={o.id} className="bg-zinc-900 rounded-2xl p-6 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{o.nom}</h3>
                    <p className="text-gray-400 text-sm">{o.role}</p>
                  </div>
                  <span className="bg-zinc-700 text-xs px-3 py-1 rounded-full">{o.disponibilite}</span>
                </div>
                <div className="flex gap-6 text-sm text-gray-400 mt-2">
                  <span>📞 {o.telephone}</span>
                  <span>📍 {o.zone}</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1">{new Date(o.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}