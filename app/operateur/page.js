"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

const etatInitial = {
  nom: "",
  telephone: "",
  role: "",
  zone: "",
  disponibilite: "",
};

export default function Operateur() {
  const [form, setForm] = useState(etatInitial);
  const [erreurs, setErreurs] = useState({});
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validerFormulaire() {
    const nouvellesErreurs = {};

    if (form.nom.trim().length < 3) {
      nouvellesErreurs.nom = "Le nom doit contenir au moins 3 caractères.";
    }

    if (!/^[0-9]{8,12}$/.test(form.telephone.replace(/\s/g, ""))) {
      nouvellesErreurs.telephone = "Numéro invalide. Utilise uniquement des chiffres (8 à 12).";
    }

    if (!form.role) {
      nouvellesErreurs.role = "Choisis le rôle qui te correspond.";
    }

    if (form.zone.trim().length < 2) {
      nouvellesErreurs.zone = "Indique ta zone ou ton quartier.";
    }

    if (!form.disponibilite) {
      nouvellesErreurs.disponibilite = "Choisis ta disponibilité.";
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validerFormulaire()) {
      return;
    }

    setLoading(true);

    const donnees = {
      ...form,
      nom: form.nom.trim(),
      telephone: form.telephone.replace(/\s/g, ""),
      zone: form.zone.trim(),
    };
    const { error } = await supabase.from("operateurs").insert([donnees]);

    if (error) {
      setErreurs({ general: "Erreur lors de l'inscription. Réessaie dans un instant." });
      console.error(error);
    } else {
      setEnvoye(true);
      setForm(etatInitial);
    }

    setLoading(false);
  }

  if (envoye) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#090909] px-6 text-white">
        <div className="text-center">
          <div className="mb-6 text-6xl">⚡</div>
          <h2 className="mb-4 text-3xl font-bold">Tu es dans la liste !</h2>
          <p className="text-lg text-gray-400">
            On t&apos;envoie ta première mission sous 48h. Prépare-toi.
          </p>
          <Link href="/" className="mt-8 inline-block rounded-full bg-orange-500 px-8 py-4 font-semibold transition hover:bg-orange-400">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <Navbar />

      <section className="mx-auto max-w-lg px-6 pb-12 pt-28">
        <h1 className="mb-2 text-3xl font-bold">Devenir opérateur</h1>
        <p className="mb-8 text-gray-400">Choisis ton rôle, travaille à ton rythme, gagne ta commission.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <Champ label="Ton nom complet" erreur={erreurs.nom}>
            <input name="nom" value={form.nom} onChange={handleChange} placeholder="Ex: Kofi Mensah" className="input-konect" />
          </Champ>

          <Champ label="Numéro de téléphone" erreur={erreurs.telephone}>
            <input name="telephone" value={form.telephone} onChange={handleChange} inputMode="numeric" placeholder="Ex: 97000000" className="input-konect" />
          </Champ>

          <Champ label="Ton rôle" erreur={erreurs.role}>
            <select name="role" value={form.role} onChange={handleChange} className="input-konect">
              <option value="">Choisir un rôle</option>
              <option value="livreur">Livreur - je livre les commandes</option>
              <option value="closer">Closer - je convaincs les clients</option>
              <option value="prospecteur">Prospecteur - je trouve des commerçants</option>
              <option value="community">Community builder - je ramène des clients</option>
            </select>
          </Champ>

          <Champ label="Zone / quartier" erreur={erreurs.zone}>
            <input name="zone" value={form.zone} onChange={handleChange} placeholder="Ex: Cadjehoun, Akpakpa..." className="input-konect" />
          </Champ>

          <Champ label="Disponibilité" erreur={erreurs.disponibilite}>
            <select name="disponibilite" value={form.disponibilite} onChange={handleChange} className="input-konect">
              <option value="">Choisir</option>
              <option value="temps_plein">Temps plein</option>
              <option value="matin">Matin seulement</option>
              <option value="aprem">Après-midi seulement</option>
              <option value="weekend">Week-end seulement</option>
            </select>
          </Champ>

          {erreurs.general && <p className="text-sm text-red-400">{erreurs.general}</p>}

          <button type="submit" disabled={loading} className="mt-4 rounded-full bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-400 disabled:opacity-50">
            {loading ? "Envoi en cours..." : "Je rejoins Konect"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Champ({ label, erreur, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-gray-400">{label}</label>
      {children}
      {erreur && <p className="mt-1 text-sm text-red-400">{erreur}</p>}
    </div>
  );
}
