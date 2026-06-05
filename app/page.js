import Link from "next/link";

export default function Home() {
  const roles = [
    {
      title: "Commercants",
      text: "Ajoute tes produits, recois des commandes et suis les opportunites depuis un seul espace.",
      accent: "border-orange-500/60",
    },
    {
      title: "Operateurs",
      text: "Prospection, livraison, closing: chaque mission est claire et remuneree a la commission.",
      accent: "border-cyan-400/60",
    },
    {
      title: "Clients",
      text: "Trouve une boutique proche, commande vite et paie avec les habitudes locales.",
      accent: "border-emerald-400/60",
    },
  ];

  const steps = [
    "La boutique publie ses offres",
    "Un operateur prend la mission",
    "Le client recoit et confirme",
  ];

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-2xl font-bold text-orange-400">
          Konect
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Navigation principale">
          <a
            href="/commercant"
            className="rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white/90 transition hover:border-white hover:bg-white hover:text-black sm:px-4"
          >
            Commercant
          </a>
          <a
            href="/operateur"
            className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-orange-400 sm:px-4"
          >
            Travailler
          </a>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Marketplace locale
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] sm:text-7xl">
            Konect
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
            Une plateforme pour relier les boutiques, les jeunes operateurs et
            les clients au Benin: vendre plus vite, livrer mieux, creer du
            revenu.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/commercant"
              className="rounded-lg bg-orange-500 px-6 py-4 text-center font-bold text-black transition hover:bg-orange-400"
            >
              Inscrire ma boutique
            </a>
            <a
              href="/operateur"
              className="rounded-lg border border-white/25 px-6 py-4 text-center font-bold text-white transition hover:border-white hover:bg-white hover:text-black"
            >
              Devenir operateur
            </a>
          </div>
        </div>

        <div className="relative min-h-[430px] overflow-hidden rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-2xl shadow-black/40">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-cyan-400 to-emerald-400" />
          <div className="grid gap-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-zinc-400">Commande active</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Pack boutique Cotonou</p>
                  <p className="text-sm text-zinc-400">
                    Livraison + confirmation client
                  </p>
                </div>
                <span className="rounded-md bg-emerald-400 px-3 py-1 text-sm font-bold text-black">
                  En cours
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-3xl font-black">24</p>
                <p className="mt-1 text-sm text-zinc-400">produits publies</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-3xl font-black">8</p>
                <p className="mt-1 text-sm text-zinc-400">missions ouvertes</p>
              </div>
            </div>
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-cyan-300 text-sm font-black text-black">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-zinc-200">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black sm:text-4xl">
              Un meme reseau, trois besoins.
            </h2>
            <p className="mt-4 leading-7 text-zinc-400">
              Konect doit devenir le point de rencontre entre l&apos;offre locale,
              les missions terrain et les commandes client.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {roles.map((role) => (
              <article
                key={role.title}
                className={`rounded-lg border ${role.accent} bg-white/[0.03] p-5`}
              >
                <h3 className="text-xl font-bold">{role.title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{role.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Konect - Cotonou, Benin</p>
        <p>Commerce local, missions terrain, livraison.</p>
      </footer>
    </main>
  );
}
