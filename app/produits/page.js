"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("");

  useEffect(() => {
    chargerProduits();
  }, []);

  async function chargerProduits() {
    const { data } = await supabase
      .from("produits")
      .select("*")
      .order("created_at", { ascending: false });
    setProduits(data || []);
    setLoading(false);
  }

  const filtres = produits.filter((p) => {
    const matchRecherche =
      p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      p.categorie.toLowerCase().includes(recherche.toLowerCase());
    const matchCategorie = categorie === "" || p.categorie === categorie;
    return matchRecherche && matchCategorie;
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="px-8 py-6 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-orange-500">Konect</a>
        <a href="/produits/ajouter" className="text-sm bg-orange-500 px-4 py-2 rounded-full hover:bg-orange-400 transition">
          + Ajouter un produit
        </a>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Catalogue</h1>
        <p className="text-gray-400 mb-8">Tous les produits disponibles à Cotonou</p>

        <div className="flex gap-4 mb-8 flex-wrap">
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un produit..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
          >
            <option value="">Toutes catégories</option>
            <option value="alimentation">Alimentation</option>
            <option value="electronique">Électronique</option>
            <option value="mode">Mode et Vêtements</option>
            <option value="beaute">Beauté et Cosmétiques</option>
            <option value="maison">Maison et Déco</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        {loading && <p className="text-gray-500">Chargement...</p>}

        {!loading && filtres.length === 0 && (
          <p className="text-gray-500">Aucun produit disponible pour l instant.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtres.map((p) => (
            <div key={p.id} className="bg-zinc-900 rounded-2xl overflow-hidden flex flex-col">
              {p.images && p.images.length > 0 && (
                <div className="relative">
                  <img
                    src={p.images[0]}
                    alt={p.nom}
                    className="w-full h-48 object-cover"
                  />
                  {p.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-xs px-2 py-1 rounded-full">
                      +{p.images.length - 1} photos
                    </span>
                  )}
                </div>
              )}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{p.nom}</h3>
                  <span className="text-orange-500 font-bold whitespace-nowrap ml-2">{p.prix} FCFA</span>
                </div>
                {p.description && (
                  <p className="text-gray-400 text-sm">{p.description}</p>
                )}
                <div className="flex justify-between items-center mt-auto pt-3">
                  <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full text-gray-400">{p.categorie}</span>
                  
                    href={"https://wa.me/" + p.telephone_commercant}
                    <a href={"https://wa.me/" + p.telephone_commercant} target="_blank" className="text-sm bg-green-600 px-4 px-4 py-2 rounded-full hover:bg-green-500 transition">Commander</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}