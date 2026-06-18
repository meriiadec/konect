"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const labelsStatut = {
  pending: "En attente",
  published: "Publié",
  rejected: "Refusé",
};

export default function Admin() {
  const [access, setAccess] = useState(false);
  const [mdp, setMdp] = useState("");
  const [erreurMdp, setErreurMdp] = useState("");
  const [message, setMessage] = useState("");
  const [verification, setVerification] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [actionProduit, setActionProduit] = useState("");
  const [commercants, setCommercants] = useState([]);
  const [operateurs, setOperateurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const [onglet, setOnglet] = useState("produits");

  useEffect(() => {
    chargerDonnees();
  }, []);

  const produitsEnAttente = useMemo(
    () => produits.filter((produit) => (produit.statut || "published") === "pending"),
    [produits],
  );

  async function chargerDonnees() {
    setChargement(true);

    const reponse = await fetch("/api/admin/session", { cache: "no-store" });

    if (!reponse.ok) {
      setAccess(false);
      setChargement(false);
      return;
    }

    const data = await reponse.json();
    setAccess(Boolean(data.authenticated));
    setCommercants(data.commercants || []);
    setOperateurs(data.operateurs || []);
    setProduits(data.produits || []);
    setChargement(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setVerification(true);
    setErreurMdp("");

    const reponse = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: mdp }),
    });

    if (reponse.ok) {
      setMdp("");
      await chargerDonnees();
    } else {
      const resultat = await reponse.json().catch(() => ({}));
      setErreurMdp(resultat.message || "Mot de passe incorrect.");
    }

    setVerification(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAccess(false);
    setCommercants([]);
    setOperateurs([]);
    setProduits([]);
  }

  async function changerStatutProduit(id, statut) {
    setActionProduit(id + statut);
    setMessage("");

    const reponse = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });

    if (!reponse.ok) {
      const resultat = await reponse.json().catch(() => ({}));
      setMessage(resultat.message || "Impossible de modifier le produit.");
      setActionProduit("");
      return;
    }

    const { produit } = await reponse.json();
    setProduits((liste) => liste.map((item) => (item.id === id ? produit : item)));
    setMessage(statut === "published" ? "Produit publié." : "Produit refusé.");
    setActionProduit("");
  }

  if (chargement) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <p className="text-gray-400">Chargement...</p>
      </main>
    );
  }

  if (!access) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] px-6 text-white">
        <div className="w-full max-w-sm rounded-lg bg-zinc-900 p-8">
          <h1 className="mb-2 text-2xl font-bold text-orange-500">Admin Konect</h1>
          <p className="mb-6 text-sm text-gray-400">Accès réservé</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={mdp}
              onChange={(e) => setMdp(e.target.value)}
              placeholder="Mot de passe"
              className="input-konect"
              autoComplete="current-password"
            />
            {erreurMdp && <p className="text-sm text-red-400">{erreurMdp}</p>}
            <button type="submit" disabled={verification} className="rounded-full bg-orange-500 py-3 font-semibold transition hover:bg-orange-400 disabled:opacity-50">
              {verification ? "Vérification..." : "Entrer"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <header className="flex flex-col gap-4 border-b border-zinc-800 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <h1 className="text-2xl font-bold text-orange-500">Dashboard Konect</h1>
          <p className="text-sm text-gray-500">Valide les produits et suis les inscriptions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-gray-400">{commercants.length} commerçants</span>
          <span className="text-gray-400">{operateurs.length} opérateurs</span>
          <span className="text-gray-400">{produits.length} produits</span>
          <span className="rounded-full bg-orange-500/15 px-3 py-1 font-semibold text-orange-300">{produitsEnAttente.length} à valider</span>
          <button type="button" onClick={handleLogout} className="rounded-full border border-white/20 px-4 py-2 font-semibold transition hover:bg-white hover:text-black">
            Sortir
          </button>
        </div>
      </header>

      <div className="px-6 py-6 sm:px-8">
        <div className="mb-8 flex flex-wrap gap-4">
          <Onglet actif={onglet === "produits"} onClick={() => setOnglet("produits")}>Produits</Onglet>
          <Onglet actif={onglet === "commercants"} onClick={() => setOnglet("commercants")}>Commerçants</Onglet>
          <Onglet actif={onglet === "operateurs"} onClick={() => setOnglet("operateurs")}>Opérateurs</Onglet>
        </div>

        {message && <p className="mb-5 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-200">{message}</p>}

        {onglet === "produits" && (
          <section className="grid gap-4">
            <ListeVide visible={produits.length === 0} message="Aucun produit enregistré." />
            {produits.map((p) => (
              <Carte key={p.id}>
                <div className="flex flex-col gap-4 sm:flex-row">
                  {p.images?.[0] && (
                    <div className="relative h-28 w-full overflow-hidden rounded-lg bg-zinc-800 sm:w-36">
                      <Image src={p.images[0]} alt={p.nom || "Produit"} fill sizes="144px" className="object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{p.nom}</h3>
                        <p className="mt-1 text-sm leading-6 text-gray-400">{p.description || "Sans description"}</p>
                      </div>
                      <Badge statut={p.statut}>{labelsStatut[p.statut] || "Publié"}</Badge>
                    </div>
                    <LigneMeta valeurs={[p.categorie, `${p.prix} FCFA`, p.telephone_commercant]} />
                    <DateCreation valeur={p.created_at} />
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => changerStatutProduit(p.id, "published")}
                        disabled={actionProduit === p.id + "published" || p.statut === "published"}
                        className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Publier
                      </button>
                      <button
                        type="button"
                        onClick={() => changerStatutProduit(p.id, "rejected")}
                        disabled={actionProduit === p.id + "rejected" || p.statut === "rejected"}
                        className="rounded-full border border-red-400/60 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                </div>
              </Carte>
            ))}
          </section>
        )}

        {onglet === "commercants" && (
          <section>
            <ListeVide visible={commercants.length === 0} message="Aucun commerçant inscrit." />
            {commercants.map((c) => (
              <Carte key={c.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">{c.boutique}</h3>
                    <p className="text-sm text-gray-400">{c.nom}</p>
                  </div>
                  <Badge>{c.secteur}</Badge>
                </div>
                <LigneMeta valeurs={[c.telephone, c.zone]} />
                <DateCreation valeur={c.created_at} />
              </Carte>
            ))}
          </section>
        )}

        {onglet === "operateurs" && (
          <section>
            <ListeVide visible={operateurs.length === 0} message="Aucun opérateur inscrit." />
            {operateurs.map((o) => (
              <Carte key={o.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">{o.nom}</h3>
                    <p className="text-sm text-gray-400">{o.role}</p>
                  </div>
                  <Badge sombre>{o.disponibilite}</Badge>
                </div>
                <LigneMeta valeurs={[o.telephone, o.zone]} />
                <DateCreation valeur={o.created_at} />
              </Carte>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function Onglet({ actif, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-full px-6 py-2 font-semibold transition ${actif ? "bg-orange-500 text-white" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}>
      {children}
    </button>
  );
}

function Carte({ children }) {
  return <div className="mb-4 flex flex-col gap-2 rounded-lg bg-zinc-900 p-6">{children}</div>;
}

function Badge({ children, sombre = false, statut }) {
  const styles = {
    pending: "bg-orange-500/15 text-orange-200",
    published: "bg-emerald-500/15 text-emerald-200",
    rejected: "bg-red-500/15 text-red-200",
  };

  if (statut) {
    return <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${styles[statut] || styles.published}`}>{children}</span>;
  }

  return <span className={`rounded-full px-3 py-1 text-xs ${sombre ? "bg-zinc-700" : "bg-orange-500 text-black"}`}>{children}</span>;
}

function LigneMeta({ valeurs }) {
  return (
    <div className="mt-2 flex flex-wrap gap-6 text-sm text-gray-400">
      {valeurs.filter(Boolean).map((valeur) => <span key={valeur}>{valeur}</span>)}
    </div>
  );
}

function DateCreation({ valeur }) {
  if (!valeur) {
    return null;
  }

  return <p className="mt-1 text-xs text-zinc-600">{new Date(valeur).toLocaleDateString("fr-FR")}</p>;
}

function ListeVide({ visible, message }) {
  return visible ? <p className="text-gray-500">{message}</p> : null;
}
