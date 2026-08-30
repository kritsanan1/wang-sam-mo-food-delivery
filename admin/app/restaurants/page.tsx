"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase-admin";

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "pending">("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, "restaurants"));
        setRestaurants(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = restaurants.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ร้านอาหาร</h1>
        <div className="flex gap-2">
          {(["all", "active", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === f ? "bg-orange-500 text-white" : "bg-white text-gray-600 border"
              }`}
            >
              {f === "all" ? "ทั้งหมด" : f === "active" ? "เปิดใช้งาน" : "รออนุมัติ"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 text-sm">ชื่อร้าน</th>
                <th className="text-left p-3 text-sm">เบอร์</th>
                <th className="text-left p-3 text-sm">สถานะ</th>
                <th className="text-left p-3 text-sm">เปิด/ปิด</th>
                <th className="text-left p-3 text-sm">คอมมิชชัน</th>
                <th className="text-right p-3 text-sm">คำสั่งทั้งหมด</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-gray-400">ไม่มีร้าน</td></tr>
              ) : (
                filtered.map((rest) => (
                  <tr key={rest.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{rest.name}</td>
                    <td className="p-3 text-sm text-gray-600">{rest.phone}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rest.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {rest.status === "active" ? "เปิดใช้งาน" : "รออนุมัติ"}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      <span className={rest.isOpen ? "text-green-600" : "text-gray-400"}>
                        {rest.isOpen ? "เปิด" : "ปิด"}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{(rest.commissionRate * 100).toFixed(0)}%</td>
                    <td className="p-3 text-sm text-right">{rest.totalOrders || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
