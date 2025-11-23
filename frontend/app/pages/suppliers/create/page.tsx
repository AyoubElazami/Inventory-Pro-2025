"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateSupplier() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const submit = async (e: any) => {
    e.preventDefault();

    await fetch("http://localhost:4000/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/pages/suppliers");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 p-6 flex justify-center items-center">

      <div className="bg-white w-full max-w-xl shadow-2xl rounded-3xl p-8 border border-teal-100">
        
        <h1 className="text-3xl font-bold text-teal-700 mb-6 text-center">
          Ajouter un fournisseur
        </h1>

        <form onSubmit={submit} className="space-y-5">

          <div>
            <label className="block text-teal-700 font-semibold mb-1">Nom du fournisseur</label>
            <input
              type="text"
              placeholder="Nom"
              className="w-full p-3 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-teal-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="exemple@mail.com"
              className="w-full p-3 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-teal-700 font-semibold mb-1">Téléphone</label>
            <input
              type="text"
              placeholder="+33 6 52 14 23 87"
              className="w-full p-3 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-teal-700 font-semibold mb-1">Adresse</label>
            <input
              type="text"
              placeholder="Adresse complète"
              className="w-full p-3 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <button
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition">
            Enregistrer
          </button>

        </form>
      </div>
    </div>
  );
}
