'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-700">Produits</h1>
          <Link
            href="../../pages/products/add"
            className="py-2 px-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition"
          >
            Ajouter un produit
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-teal-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Nom</th>
                <th className="border border-gray-300 px-4 py-2">Quantité</th>
                <th className="border border-gray-300 px-4 py-2">Prix</th>
              </tr>
            </thead>
            <tbody>
  {products.map((p) => (
    <tr key={p.id} className="hover:bg-teal-50 transition">
      <td className="border border-gray-300 px-4 py-2 text-center">{p.id}</td>
      <td className="border border-gray-300 px-4 py-2">{p.name}</td>
      <td className="border border-gray-300 px-4 py-2 text-center">{p.quantity}</td>
      <td className="border border-gray-300 px-4 py-2 text-right">{(Number(p.price) || 0).toFixed(2)} €</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
