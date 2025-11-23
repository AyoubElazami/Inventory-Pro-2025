"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menu = [
    { href: "/pages/reports", label: "Rapport de stock" },

    { href: "/pages/products/index", label: "Produits" },
    { href: "/pages/suppliers", label: "Fournisseurs" },
    { href: "/pages/orders/create", label: "Créer une Commande" },
    { href: "/pages/orders/list", label: "list des Commandes" },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 flex">

      {/* Sidebar */}
      <aside className="w-64 p-6 bg-white rounded-tr-3xl rounded-br-3xl shadow-2xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-teal-700">Inventory Pro</h1>

        <nav className="flex flex-col gap-2 mt-4">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                pathname.startsWith(item.href)
                  ? "bg-teal-600 text-white"
                  : "text-teal-700 hover:bg-teal-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
