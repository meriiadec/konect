"use client";
import { useState } from "react";

export default function Commercant() {
  const [form, setForm] = useState({
    nom: "",
    boutique: "",
    secteur: "",
    telephone: "",
    zone: "",
  });
  const [envoye, setEnvoye] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setEnvoye(true);
  }

  if (envoye) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold mb-4">Inscription reçue !</h2>
          <p className="text-gray-400 text-lg">
            Nous allons vous contacter sous 24h pour activer votre boutique sur Konect.
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
        <h1 className="text-3xl font-bold mb-2">Inscrire ma boutique</h1>
        <p className="text-gray-400 mb-8">Rejoins Konect et commence à vendre plus dès aujourd'hui.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Ton nom complet</label>
            <input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              placeholder="Ex: Adjoua Koffi"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Nom de ta boutique</label>
            <input
              name="boutique"
              value={form.boutique}
              onChange={handleChange}
              required
              placeholder="Ex: Boutique Grâce"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Secteur d'activité</label>
            <select
              name="secteur"
              value={form.secteur}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Choisir un secteur</option>
              <option value="alimentation">Alimentation</option>
              <option value="electronique">Électronique</option>
              <option value="mode">Mode & Vêtements</option>
              <option value="beaute">Beauté & Cosmétiques</option>
              <option value="autre">Autre</option>
            </select>
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

          <button
            type="submit"
            className="mt-4 bg-orange-500 px-8 py-4 rounded-full font-semibold text-white hover:bg-orange-400 transition"
          >
            Soumettre mon inscription
          </button>
        </form>
      </section>
    </main>
  );
}