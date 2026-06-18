"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("");

  useEffect(() => {
    let actif = true;

    async function chargerProduits() {
      const { data, error } = await supabase
        .from("produits")
        .select("*")
        .order("created_at", { ascending: false });

      if (!actif) {
        return;
      }

      if (error) {
        setErreur("Impossible de charger le catalogue pour le moment.");
        console.error(error);
      } else {
        setProduits(data || []);
      }

      setLoading(false);
    }

    chargerProduits();

    return () => {
      actif = false;
    };
  }, []);

  const filtres = useMemo(() => {
    return produits.filter((p) => {
      const nom = p.nom || "";
      const categorieProduit = p.categorie || "";
      const matchRecherche =
        nom.toLowerCase().includes(recherche.toLowerCase()) ||
        categorieProduit.toLowerCase().includes(recherche.toLowerCase());
      const matchCategorie = categorie === "" || categorieProduit === categorie;
      return matchRecherche && matchCategorie;
    });
  }, [categorie, produits, recherche]);

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 pb-12 pt-28">
        <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Catalogue</h1>
          <a href="/produits/ajouter" className="rounded-full bg-orange-500 px-4 py-2 text-center text-sm font-semibold transition hover:bg-orange-400">
            Ajouter un produit
          </a>
        </div>
        <p className="mb-8 text-gray-400">Tous les produits disponibles à Cotonou.</p>

        <div className="mb-8 flex flex-wrap gap-4">
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un produit..."
            className="input-konect min-w-64 flex-1"
          />
          <select value={categorie} onChange={(e) => setCategorie(e.target.value)} className="input-konect sm:w-56">
            <option value="">Toutes catégories</option>
            <option value="alimentation">Alimentation</option>
            <option value="electronique">Électronique</option>
            <option value="mode">Mode et vêtements</option>
            <option value="beaute">Beauté et cosmétiques</option>
            <option value="maison">Maison et déco</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        {loading && <p className="text-gray-500">Chargement...</p>}
        {erreur && <p className="text-red-400">{erreur}</p>}

        {!loading && !erreur && filtres.length === 0 && (
          <p className="text-gray-500">Aucun produit disponible pour l&apos;instant.</p>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtres.map((p) => {
            const telephone = String(p.telephone_commercant || "").replace(/\D/g, "");
            const lienWhatsapp = telephone ? `https://wa.me/${telephone}` : "#";

            return (
              <article key={p.id} className="flex flex-col overflow-hidden rounded-lg bg-zinc-900">
                {p.images?.length > 0 && (
                  <div className="relative h-48 w-full">
                    <Image src={p.images[0]} alt={p.nom || "Produit Konect"} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                    {p.images.length > 1 && (
                      <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs">
                        +{p.images.length - 1} photos
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold">{p.nom}</h3>
                    <span className="whitespace-nowrap font-bold text-orange-500">{p.prix} FCFA</span>
                  </div>
                  {p.description && <p className="text-sm leading-6 text-gray-400">{p.description}</p>}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-gray-400">{p.categorie}</span>
                    <a href={lienWhatsapp} target="_blank" rel="noreferrer" className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold transition hover:bg-green-500">
                      Commander
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
