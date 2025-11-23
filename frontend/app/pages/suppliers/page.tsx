'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/suppliers")
      .then((res) => res.json())
      .then(setSuppliers)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-700">Fournisseurs</h1>
          <Link
            href="../../pages/suppliers/create"
            className="py-2 px-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition"
          >
            Ajouter un fournisseur
          </Link>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-teal-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Nom</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Téléphone</th>
              </tr>
            </thead>

            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-teal-50 transition">
                  <td className="border border-gray-300 px-4 py-2 text-center">{s.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{s.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{s.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{s.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
