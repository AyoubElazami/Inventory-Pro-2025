"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiClient.get("/api/orders")
      .then(setOrders)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 p-6">
      
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-700">Commandes</h1>

          <Link
            href="/pages/orders/create"
            className="py-2 px-5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition"
          >
            Nouvelle commande
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 rounded-xl">
            <thead className="bg-teal-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Client</th>
                <th className="border border-gray-300 px-4 py-2">Total</th>
                <th className="border border-gray-300 px-4 py-2">Articles</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id} className="hover:bg-teal-50 transition">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {o.customerName}
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {(Number(o.total) || 0).toFixed(2)} €
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {o.OrderItems?.length || 0}
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
