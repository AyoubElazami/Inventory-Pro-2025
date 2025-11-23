"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReportsPage() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then((res) => res.json())
      .then(setProducts);

    fetch("http://localhost:4000/api/suppliers")
      .then((res) => res.json())
      .then(setSuppliers);

    fetch("http://localhost:4000/api/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  // Calculs
  const outOfStock = products.filter((p: any) => p.quantity === 0);
  const lowStock = products.filter((p: any) => p.quantity > 0 && p.quantity < 5);
  const inventoryValue = products.reduce(
    (sum: number, p: any) => sum + p.quantity * Number(p.price),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 p-6">

      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700">
            Rapport d’inventaire
          </h1>

          <Link
            href="/"
            className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-semibold"
          >
            Retour
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="p-6 bg-teal-100 border border-teal-300 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-teal-800">Produits en rupture</h2>
            <p className="text-3xl font-bold text-red-500 mt-3">{outOfStock.length}</p>
          </div>

          <div className="p-6 bg-yellow-100 border border-yellow-300 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-yellow-800">Stock faible</h2>
            <p className="text-3xl font-bold text-yellow-600 mt-3">{lowStock.length}</p>
          </div>

          <div className="p-6 bg-green-100 border border-green-300 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-green-800">Valeur totale</h2>
            <p className="text-3xl font-bold text-green-600 mt-3">
              {inventoryValue.toFixed(2)} €
            </p>
          </div>

        </div>

        {/* More Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          <div className="p-6 bg-purple-100 border border-purple-300 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-purple-800">Fournisseurs</h2>
            <p className="text-3xl font-bold text-purple-600 mt-3">{suppliers.length}</p>
          </div>

          <div className="p-6 bg-blue-100 border border-blue-300 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-blue-800">Commandes</h2>
            <p className="text-3xl font-bold text-blue-600 mt-3">{orders.length}</p>
          </div>

        </div>

        {/* Table of products */}
        <h2 className="text-2xl font-bold text-teal-700 mb-4">
          Détails des produits
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-teal-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Nom</th>
                <th className="border border-gray-300 px-4 py-2">Quantité</th>
                <th className="border border-gray-300 px-4 py-2">Prix</th>
                <th className="border border-gray-300 px-4 py-2">Statut</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-teal-50 transition">
                  <td className="border border-gray-300 px-4 py-2">{p.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{p.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{p.price} €</td>

                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {p.quantity === 0 ? (
                      <span className="text-red-600 font-bold">Rupture</span>
                    ) : p.quantity < 5 ? (
                      <span className="text-yellow-600 font-bold">Faible</span>
                    ) : (
                      <span className="text-green-600 font-bold">OK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
