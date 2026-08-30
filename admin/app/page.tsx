"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase-admin";

interface Order {
  id: string;
  restaurantName?: string;
  status: string;
  total: number;
  createdAt?: any;
}

interface Restaurant {
  id: string;
  name: string;
  isOpen: boolean;
}

interface Rider {
  id: string;
  name: string;
  isOnline: boolean;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(20)));
        setOrders(ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order));

        const restSnap = await getDocs(collection(db, "restaurants"));
        setRestaurants(restSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Restaurant));

        const riderSnap = await getDocs(collection(db, "riders"));
        setRiders(riderSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Rider));
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6"><p className="text-gray-500">กำลังโหลด...</p></div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-gray-500 text-sm">ร้านทั้งหมด</p>
          <p className="text-3xl font-bold text-orange-500">{restaurants.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-gray-500 text-sm">Rider ทั้งหมด</p>
          <p className="text-3xl font-bold text-teal-500">{riders.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-gray-500 text-sm">คำสั่งล่าสุด</p>
          <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">คำสั่งล่าสุด</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 text-sm">เลขคำสั่ง</th>
              <th className="text-left p-3 text-sm">ร้าน</th>
              <th className="text-left p-3 text-sm">สถานะ</th>
              <th className="text-right p-3 text-sm">ยอด</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-gray-400">ยังไม่มีคำสั่ง</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3 text-sm">#{order.id.slice(-6)}</td>
                  <td className="p-3 text-sm">{order.restaurantName || "—"}</td>
                  <td className="p-3 text-sm">{order.status}</td>
                  <td className="p-3 text-sm text-right">{order.total} ฿</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
