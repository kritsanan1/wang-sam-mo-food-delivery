"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase-admin";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, "orders"));
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = orders.filter((o) => statusFilter === "all" || o.status === statusFilter);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    preparing: "bg-blue-100 text-blue-700",
    ready: "bg-purple-100 text-purple-700",
    picked_up: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    rejected: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    pending: "รอรับ", accepted: "รับแล้ว", preparing: "กำลังทำ", ready: "พร้อมส่ง",
    picked_up: "กำลังส่ง", delivered: "ส่งแล้ว", cancelled: "ยกเลิก", rejected: "ปฏิเสธ",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">คำสั่งทั้งหมด</h1>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {["all", "pending", "accepted", "preparing", "ready", "picked_up", "delivered", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              statusFilter === s ? "bg-orange-500 text-white" : "bg-white text-gray-600 border"
            }`}
          >
            {s === "all" ? "ทั้งหมด" : statusLabels[s] || s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 text-sm">เลขคำสั่ง</th>
                <th className="text-left p-3 text-sm">ร้าน</th>
                <th className="text-left p-3 text-sm">ลูกค้า</th>
                <th className="text-left p-3 text-sm">Rider</th>
                <th className="text-left p-3 text-sm">สถานะ</th>
                <th className="text-left p-3 text-sm">ชำระ</th>
                <th className="text-right p-3 text-sm">ยอด</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-gray-400">ไม่มีคำสั่ง</td></tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">#{order.id.slice(-6)}</td>
                    <td className="p-3 text-sm">{order.restaurantName || "—"}</td>
                    <td className="p-3 text-sm text-gray-600">{order.customerPhone || "—"}</td>
                    <td className="p-3 text-sm text-gray-600">{order.riderId ? "มี" : "—"}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`text-xs ${order.paymentStatus === "paid" ? "text-green-600" : "text-gray-400"}`}>
                        {order.paymentStatus === "paid" ? "จ่ายแล้ว" : "รอชำระ"}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-right font-medium">{order.total} ฿</td>
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
