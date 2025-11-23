'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 flex flex-col">

      {/* Header */}
      <header className="bg-teal-700 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Inventory Pro 2025</h1>
          <nav className="space-x-6">
            <Link href="/pages/products/index" className="hover:text-teal-200 transition font-semibold">
              Produits
            </Link>
            <Link href="pages/orders/create" className="hover:text-teal-200 transition font-semibold">
              Créer commande
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center p-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-teal-800 mb-4">
          Gérez votre inventaire facilement
        </h2>
        <p className="text-teal-600 text-lg md:text-xl max-w-3xl mb-6">
          Suivez vos produits, commandes et fournisseurs avec une interface moderne et intuitive.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="pages/products/index"
            className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition"
          >
            Voir les produits
          </Link>
          <Link
            href="pages/orders/create"
            className="px-6 py-3 rounded-xl bg-teal-200 text-teal-800 font-semibold hover:bg-teal-300 transition"
          >
            Créer une commande
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold mb-2 text-teal-700">Gestion des produits</h3>
            <p className="text-teal-600">
              Ajoutez, modifiez et suivez tous vos produits avec précision et facilité.
            </p>
          </div>
          <div className="p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold mb-2 text-teal-700">Commandes simplifiées</h3>
            <p className="text-teal-600">
              Créez et gérez vos commandes en quelques clics, suivi automatique des quantités et prix.
            </p>
          </div>
          <div className="p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold mb-2 text-teal-700">Suivi des fournisseurs</h3>
            <p className="text-teal-600">
              Gardez un œil sur vos fournisseurs et contacts importants pour ne jamais manquer de stock.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-800 text-white p-6 mt-auto text-center">
        &copy; 2025 Inventory Pro. Tous droits réservés.
      </footer>

    </div>
  );
}
