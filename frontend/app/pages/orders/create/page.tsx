"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/api";

export default function CreateOrder() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [items, setItems] = useState<any[]>([]);
  const [customer, setCustomer] = useState({ name: "", email: "" });

  // Load products
  useEffect(() => {
    apiClient.get("/api/products")
      .then(setProducts)
      .catch((err) => console.error(err));
  }, []);

  const addItem = (product: any) => {
    setItems([...items, { productId: product.id, quantity: 1, name: product.name }]);
  };

  const submit = async () => {
    await apiClient.post("/api/orders", {
      customerName: customer.name,
      customerEmail: customer.email,
      items,
    });

    router.push("/pages/orders");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 p-6">
      
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-700">Créer une commande</h1>

          <Link
            href="/pages/orders"
            className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition"
          >
            Retour
          </Link>
        </div>

        {/* Customer Form */}
        <h2 className="text-xl text-teal-700 font-bold mb-4">Informations client</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          <input
            type="text"
            placeholder="Nom du client"
            className="w-full p-3 border border-gray-300 rounded-xl bg-teal-50 focus:ring-2 focus:ring-teal-400 outline-none"
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email du client"
            className="w-full p-3 border border-gray-300 rounded-xl bg-teal-50 focus:ring-2 focus:ring-teal-400 outline-none"
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          />

        </div>

        {/* Product Selection */}
        <h2 className="text-xl text-teal-700 font-bold mb-4">Choisir les produits</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {products.map((p: any) => (
            <button
              key={p.id}
              onClick={() => addItem(p)}
              className="p-4 bg-teal-100 border border-teal-300 rounded-xl hover:bg-teal-200 hover:shadow-md transition font-semibold text-teal-800"
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Selected Items */}
        <h2 className="text-xl text-teal-700 font-bold mb-4">Articles sélectionnés</h2>

        {items.length === 0 && (
          <p className="text-gray-600 italic mb-4">Aucun produit sélectionné.</p>
        )}

        <div className="space-y-3">
          {items.map((it, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-teal-50 p-3 rounded-xl border border-teal-200"
            >
              <span className="flex-1 font-semibold text-teal-700">{it.name}</span>

              <input
                type="number"
                min={1}
                value={it.quantity}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i].quantity = parseInt(e.target.value);
                  setItems(updated);
                }}
                className="w-24 p-2 border border-gray-300 rounded-xl"
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={submit}
          className="mt-8 w-full py-3 bg-teal-600 text-white font-bold text-lg rounded-xl hover:bg-teal-700 transition shadow-lg"
        >
          Confirmer la commande
        </button>

      </div>
    </div>
  );
}
