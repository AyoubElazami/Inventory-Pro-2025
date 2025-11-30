'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';

export default function AddProduct() {
  const [form, setForm] = useState({ sku: '', name: '', price: 0, quantity: 0, supplierId: null });
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await apiClient.post('/api/products', form);
    router.push('/pages/products/index');
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 flex justify-center items-start p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-teal-700 mb-6 text-center">Ajouter un produit</h1>
        
        <form onSubmit={submit} className="space-y-6">
          
          
          <input
            type="text"
            placeholder="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none transition"
          />
          
          <input
            type="number"
            placeholder="Prix"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none transition"
          />
          
          <input
            type="number"
            placeholder="Quantité"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none transition"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition"
          >
            Ajouter le produit
          </button>
        </form>
      </div>
    </div>
  );
}
