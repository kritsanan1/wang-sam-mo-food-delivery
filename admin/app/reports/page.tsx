"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase-admin";

export default function AdminReportsPage() {
  const [stats, setStats] = useState({ totalOrders: 0, totalGMV: 0, totalCommission: 0, avgOrder: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, "orders"));
        const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as any);
        const delivered = orders.filter((o) => o.status === "delivered");
        const totalGMV = delivered.reduce((s, o) => s + (o.total || 0), 0);
        const totalCommission = delivered.reduce((s, o) => s + (o.commission || 0), 0);
        setStats({
          totalOrders: orders.length,
          totalGMV,
          totalCommission,
          avgOrder: delivered.length > 0 ? totalGMV / delivered.length : 0,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const cards = [
    { label: "คำสั่งทั้งหมด", value: stats.totalOrders, color: "text-gray-800" },
    { label: "GMV (ยอดส่งสำเร็จ)", value: `${stats.totalGMV.toLocaleString()} ฿`, color: "text-orange-500" },
    { label: "รายได้แพลตฟอร์ม", value: `${stats.totalCommission.toLocaleString()} ฿`, color: "text-teal-500" },
    { label: "ยอดเฉลี่ย/คำสั่ง", value: `${stats.avgOrder.toFixed(0)} ฿`, color: "text-purple-500" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">รายงาน & Analytics</h1>
      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {cards.map((card) => (
              <div key={card.label} className="bg-white rounded-lg p-4 shadow">
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className={`text-2xl font-bold mt-2 ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-400 text-center">กราฟและสถิติเพิ่มเติมจะเพิ่มในเฟส 2 (Recharts integration)</p>
          </div>
        </>
      )}
    </div>
  );
}
