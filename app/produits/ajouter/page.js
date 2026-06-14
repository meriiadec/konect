"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AjouterProduit() {
  const [form, setForm] = useState({
    nom: "",
    prix: "",
    description: "",
    categorie: "",
    telephone_commercant: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImages(e) {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const imageUrls = [];

    for (const image of images) {
      const nomFichier = `${Date.now()}-${image.name}`;
      const { error } = await supabase.storage
        .from("produits")
        .upload(nomFichier, image);

      if (error) {
        console.error(error);
        continue;
      }

      const { data } = supabase.storage
        .from("produits")
        .getPublicUrl(nomFichier);

      imageUrls.push(data.publicUrl);
    }

    const { error } = await supabase.from("produits").insert([
      { ...form, images: imageUrls },
    ]);

    if (error) {
      alert("Erreur. Réessaie.");
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
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-3xl font-bold mb-4">Produit publié !</h2>
          <p className="text-gray-400 text-lg mb-8">Ton produit est visible sur le catalogue Konect.</p>
          <div className="flex gap-4 justify-center">
            <a href="/produits" className="bg-orange-500 px-8 py-4 rounded-full font-semibold hover:bg-orange-400 transition">
              Voir le catalogue
            </a>
            <a href="/produits/ajouter" className="border border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black transition">
              Ajouter un autre
            </a>
          </div>
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
        <h1 className="text-3xl font-bold mb-2">Ajouter un produit</h1>
        <p className="text-gray-400 mb-8">Publie ton produit sur le catalogue Konect.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Nom du produit</label>
            <input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              placeholder="Ex: Sac en cuir marron"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Prix (FCFA)</label>
            <input
              name="prix"
              value={form.prix}
              onChange={handleChange}
              required
              placeholder="Ex: 15000"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Décris ton produit en quelques mots..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Catégorie</label>
            <select
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Choisir une catégorie</option>
              <option value="alimentation">Alimentation</option>
              <option value="electronique">Électronique</option>
              <option value="mode">Mode & Vêtements</option>
              <option value="beaute">Beauté & Cosmétiques</option>
              <option value="maison">Maison & Déco</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Ton numéro WhatsApp</label>
            <input
              name="telephone_commercant"
              value={form.telephone_commercant}
              onChange={handleChange}
              required
              placeholder="Ex: 22997000000"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Photos du produit</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
            />
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {previews.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-24 h-24 object-cover rounded-xl border border-zinc-700" />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-orange-500 px-8 py-4 rounded-full font-semibold text-white hover:bg-orange-400 transition disabled:opacity-50"
          >
            {loading ? "Publication en cours..." : "Publier le produit"}
          </button>
        </form>
      </section>
    </main>
  );
}