"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase-admin";

export default function AdminRidersPage() {
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, "riders"));
        setRiders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Rider</h1>

      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 text-sm">ชื่อ</th>
                <th className="text-left p-3 text-sm">เบอร์</th>
                <th className="text-left p-3 text-sm">ประเภทรถ</th>
                <th className="text-left p-3 text-sm">สถานะ</th>
                <th className="text-left p-3 text-sm">ออนไลน์</th>
                <th className="text-right p-3 text-sm">งานส่ง</th>
                <th className="text-right p-3 text-sm">รายได้</th>
                <th className="text-right p-3 text-sm">คะแนน</th>
              </tr>
            </thead>
            <tbody>
              {riders.length === 0 ? (
                <tr><td colSpan={8} className="p-6 text-center text-gray-400">ไม่มี Rider</td></tr>
              ) : (
                riders.map((rider) => (
                  <tr key={rider.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{rider.name}</td>
                    <td className="p-3 text-sm text-gray-600">{rider.phone}</td>
                    <td className="p-3 text-sm text-gray-600">{rider.vehicleType || "—"}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rider.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {rider.status === "active" ? "ใช้งาน" : "รออนุมัติ"}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      <span className={rider.isOnline ? "text-green-600" : "text-gray-400"}>
                        {rider.isOnline ? "🟢 ออนไลน์" : "⚪ ออฟไลน์"}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-right">{rider.totalDeliveries || 0}</td>
                    <td className="p-3 text-sm text-right font-medium">{(rider.totalEarnings || 0).toFixed(0)} ฿</td>
                    <td className="p-3 text-sm text-right">⭐ {rider.rating?.toFixed(1) || "—"}</td>
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
