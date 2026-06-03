export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold text-orange-500">Konect</h1>
        <div className="flex gap-4">
          <a href="/commercant" className="text-sm border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition">
            Je suis commerçant
          </a>
          <a href="/operateur" className="text-sm bg-orange-500 px-4 py-2 rounded-full hover:bg-orange-400 transition">
            Je veux travailler
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20">
        <h2 className="text-5xl font-bold leading-tight max-w-2xl">
          Connecte commerçants, jeunes et clients au Bénin
        </h2>
        <p className="mt-6 text-lg text-gray-400 max-w-xl">
          Vends plus. Gagne ta vie. Trouve ce dont tu as besoin. 
          Konect réunit tout le monde sur une seule plateforme.
        </p>
        <div className="mt-10 flex gap-4">
          <a href="/commercant" className="bg-orange-500 px-8 py-4 rounded-full font-semibold hover:bg-orange-400 transition">
            Inscrire ma boutique
          </a>
          <a href="/operateur" className="border border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black transition">
            Devenir opérateur
          </a>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="px-8 py-16 bg-zinc-900">
        <h3 className="text-center text-3xl font-bold mb-12">Comment ça marche</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-4">🏪</div>
            <h4 className="font-bold text-lg mb-2">Le commerçant publie</h4>
            <p className="text-gray-400 text-sm">Il liste ses produits sur Konect et reçoit des commandes.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="font-bold text-lg mb-2">L'opérateur agit</h4>
            <p className="text-gray-400 text-sm">Livreur, closer, prospecteur — chacun joue son rôle et gagne sa commission.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📦</div>
            <h4 className="font-bold text-lg mb-2">Le client reçoit</h4>
            <p className="text-gray-400 text-sm">Commande simple, livraison rapide, paiement MoMo.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 text-sm">
        © 2026 Konect — Cotonou, Bénin
      </footer>

    </main>
  );
}