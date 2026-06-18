"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { supabase } from "../../../lib/supabase";

const etatInitial = {
  nom: "",
  prix: "",
  description: "",
  categorie: "",
  telephone_commercant: "",
};

export default function AjouterProduit() {
  const [form, setForm] = useState(etatInitial);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [erreurs, setErreurs] = useState({});
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => previews.forEach((src) => URL.revokeObjectURL(src));
  }, [previews]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImages(e) {
    const files = Array.from(e.target.files).slice(0, 4);
    const nouvellesErreurs = {};

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        nouvellesErreurs.images = "Ajoute uniquement des images.";
      }

      if (file.size > 3 * 1024 * 1024) {
        nouvellesErreurs.images = "Chaque image doit faire moins de 3 Mo.";
      }
    }

    previews.forEach((src) => URL.revokeObjectURL(src));
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
    setErreurs((etat) => ({ ...etat, ...nouvellesErreurs }));
  }

  function validerFormulaire() {
    const nouvellesErreurs = {};
    const prix = Number(form.prix);

    if (form.nom.trim().length < 2) {
      nouvellesErreurs.nom = "Le nom du produit est trop court.";
    }

    if (!Number.isFinite(prix) || prix <= 0) {
      nouvellesErreurs.prix = "Indique un prix valide.";
    }

    if (!form.categorie) {
      nouvellesErreurs.categorie = "Choisis une catégorie.";
    }

    if (!/^[0-9]{8,15}$/.test(form.telephone_commercant.replace(/\s/g, ""))) {
      nouvellesErreurs.telephone_commercant = "Numéro WhatsApp invalide.";
    }

    if (images.length === 0) {
      nouvellesErreurs.images = "Ajoute au moins une photo du produit.";
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

    const imageUrls = [];

    for (const image of images) {
      const extension = image.name.split(".").pop();
      const nomFichier = `${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("produits").upload(nomFichier, image, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        setErreurs({ general: "Une image n&apos;a pas pu être envoyée. Réessaie." });
        console.error(error);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("produits").getPublicUrl(nomFichier);
      imageUrls.push(data.publicUrl);
    }

    const nouveauProduit = {
      nom: form.nom.trim(),
      prix: Number(form.prix),
      description: form.description.trim(),
      categorie: form.categorie,
      telephone_commercant: form.telephone_commercant.replace(/\s/g, ""),
      images: imageUrls,
      statut: "pending",
    };
    const { error } = await supabase.from("produits").insert([nouveauProduit]);

    if (error) {
      setErreurs({ general: "Erreur lors de la publication. Réessaie." });
      console.error(error);
    } else {
      setEnvoye(true);
      setForm(etatInitial);
      setImages([]);
      setPreviews([]);
    }

    setLoading(false);
  }

  if (envoye) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#090909] px-6 text-white">
        <div className="text-center">
          <div className="mb-6 text-6xl">🎯</div>
          <h2 className="mb-4 text-3xl font-bold">Produit envoyé !</h2>
          <p className="mb-8 text-lg text-gray-400">Ton produit est enregistré et peut être validé depuis l&apos;espace admin.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/produits" className="rounded-full bg-orange-500 px-8 py-4 font-semibold transition hover:bg-orange-400">
              Voir le catalogue
            </Link>
            <Link href="/produits/ajouter" className="rounded-full border border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-black">
              Ajouter un autre
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <Navbar />

      <section className="mx-auto max-w-lg px-6 pb-12 pt-28">
        <h1 className="mb-2 text-3xl font-bold">Ajouter un produit</h1>
        <p className="mb-8 text-gray-400">Publie ton produit sur le catalogue Konect.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <Champ label="Nom du produit" erreur={erreurs.nom}>
            <input name="nom" value={form.nom} onChange={handleChange} placeholder="Ex: Sac en cuir marron" className="input-konect" />
          </Champ>

          <Champ label="Prix (FCFA)" erreur={erreurs.prix}>
            <input name="prix" value={form.prix} onChange={handleChange} inputMode="numeric" placeholder="Ex: 15000" className="input-konect" />
          </Champ>

          <Champ label="Description">
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Décris ton produit en quelques mots..." rows={3} className="input-konect" />
          </Champ>

          <Champ label="Catégorie" erreur={erreurs.categorie}>
            <select name="categorie" value={form.categorie} onChange={handleChange} className="input-konect">
              <option value="">Choisir une catégorie</option>
              <option value="alimentation">Alimentation</option>
              <option value="electronique">Électronique</option>
              <option value="mode">Mode et vêtements</option>
              <option value="beaute">Beauté et cosmétiques</option>
              <option value="maison">Maison et déco</option>
              <option value="autre">Autre</option>
            </select>
          </Champ>

          <Champ label="Ton numéro WhatsApp" erreur={erreurs.telephone_commercant}>
            <input name="telephone_commercant" value={form.telephone_commercant} onChange={handleChange} inputMode="numeric" placeholder="Ex: 22997000000" className="input-konect" />
          </Champ>

          <Champ label="Photos du produit" erreur={erreurs.images}>
            <input type="file" accept="image/*" multiple onChange={handleImages} className="input-konect" />
            {previews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {previews.map((src) => (
                  <div key={src} className="relative h-24 w-24 overflow-hidden rounded-lg border border-zinc-700">
                    <Image src={src} alt="" fill sizes="96px" className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}
          </Champ>

          {erreurs.general && <p className="text-sm text-red-400">{erreurs.general}</p>}

          <button type="submit" disabled={loading} className="mt-4 rounded-full bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-400 disabled:opacity-50">
            {loading ? "Publication en cours..." : "Publier le produit"}
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
