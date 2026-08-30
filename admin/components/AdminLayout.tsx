"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Store, 
  Bike, 
  Package, 
  BarChart3, 
  Tag,
  Settings 
} from "lucide-react";

const navItems = [
  { label: "แดชบอร์ด", href: "/", icon: LayoutDashboard },
  { label: "ร้านอาหาร", href: "/restaurants", icon: Store },
  { label: "Rider", href: "/riders", icon: Bike },
  { label: "คำสั่ง", href: "/orders", icon: Package },
  { label: "รายงาน", href: "/reports", icon: BarChart3 },
  { label: "โปรโมชัน", href: "/promotions", icon: Tag },
  { label: "ตั้งค่า", href: "/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold text-orange-500">วังสามหมอ</h1>
          <p className="text-sm text-gray-500">Food Delivery Admin</p>
        </div>
        <nav className="px-3 pb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-orange-50 text-orange-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
}
