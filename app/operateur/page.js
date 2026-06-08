"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Operateur() {
  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    role: "",
    zone: "",
    disponibilite: "",
  });
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("operateurs")
      .insert([form]);

    if (error) {
      alert("Erreur lors de l'inscription. Réessaie.");
      console.error(error);
    } else {
      setEnvoye(true);
    }
    setLoading(false);
  }

  if (envoye) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-6">⚡</div>
          <h2 className="text-3xl font-bold mb-4">Tu es dans la liste !</h2>
          <p className="text-gray-400 text-lg">
            On t'envoie ta première mission sous 48h. Prépare-toi.
          </p>
          <a href="/" className="mt-8 inline-block bg-orange-500 px-8 py-4 rounded-full font-semibold hover:bg-orange-400 transition">
            Retour à l'accueil
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="px-8 py-6">
        <a href="/" className="text-2xl font-bold text-orange-500">Konect</a>
      </header>

      <section className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Devenir opérateur</h1>
        <p className="text-gray-400 mb-8">Choisis ton rôle, travaille à ton rythme, gagne ta commission.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Ton nom complet</label>
            <input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              placeholder="Ex: Kofi Mensah"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Numéro de téléphone</label>
            <input
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              required
              placeholder="Ex: 97000000"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Ton rôle</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Choisir un rôle</option>
              <option value="livreur">Livreur — je livre les commandes</option>
              <option value="closer">Closer — je convaincs les clients</option>
              <option value="prospecteur">Prospecteur — je trouve des commerçants</option>
              <option value="community">Community builder — je ramène des clients</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Zone / Quartier</label>
            <input
              name="zone"
              value={form.zone}
              onChange={handleChange}
              required
              placeholder="Ex: Cadjehoun, Akpakpa..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Disponibilité</label>
            <select
              name="disponibilite"
              value={form.disponibilite}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Choisir</option>
              <option value="temps_plein">Temps plein</option>
              <option value="matin">Matin seulement</option>
              <option value="aprem">Après-midi seulement</option>
              <option value="weekend">Weekend seulement</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-orange-500 px-8 py-4 rounded-full font-semibold text-white hover:bg-orange-400 transition disabled:opacity-50"
          >
            {loading ? "Envoi en cours..." : "Je rejoins Konect"}
          </button>
        </form>
      </section>
    </main>
  );
}