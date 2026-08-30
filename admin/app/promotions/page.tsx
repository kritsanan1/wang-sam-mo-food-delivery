"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase-admin";

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: "", type: "fixed", value: "", minOrder: "" });

  const fetch = async () => {
    try {
      const snap = await getDocs(collection(db, "promotions"));
      setPromos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const addPromo = async () => {
    if (!newPromo.code || !newPromo.value) return;
    await addDoc(collection(db, "promotions"), {
      code: newPromo.code.toUpperCase(),
      type: newPromo.type,
      value: parseFloat(newPromo.value),
      minOrder: parseFloat(newPromo.minOrder) || 0,
      maxUses: 1000,
      usedCount: 0,
      isActive: true,
      expiresAt: new Date("2026-12-31"),
    });
    setNewPromo({ code: "", type: "fixed", value: "", minOrder: "" });
    setShowAdd(false);
    fetch();
  };

  const removePromo = async (id: string) => {
    await deleteDoc(doc(db, "promotions", id));
    fetch();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">โปรโมชัน</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium">
          + สร้างโปร
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-4 gap-3">
          <input className="border rounded-lg p-2 text-sm" placeholder="รหัส (เช่น SAVE20)" value={newPromo.code} onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })} />
          <select className="border rounded-lg p-2 text-sm" value={newPromo.type} onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}>
            <option value="fixed">ส่วนลด (บาท)</option>
            <option value="percent">ส่วนลด (%)</option>
          </select>
          <input className="border rounded-lg p-2 text-sm" placeholder="มูลค่า" type="number" value={newPromo.value} onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })} />
          <input className="border rounded-lg p-2 text-sm" placeholder="ยอดขั้นต่ำ" type="number" value={newPromo.minOrder} onChange={(e) => setNewPromo({ ...newPromo, minOrder: e.target.value })} />
          <button onClick={addPromo} className="col-span-4 bg-teal-500 text-white rounded-lg py-2 text-sm font-medium">เพิ่ม</button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 text-sm">รหัส</th>
                <th className="text-left p-3 text-sm">ประเภท</th>
                <th className="text-right p-3 text-sm">มูลค่า</th>
                <th className="text-right p-3 text-sm">ขั้นต่ำ</th>
                <th className="text-right p-3 text-sm">ใช้แล้ว</th>
                <th className="text-left p-3 text-sm">สถานะ</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {promos.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-gray-400">ไม่มีโปรโมชัน</td></tr>
              ) : (
                promos.map((promo) => (
                  <tr key={promo.id} className="border-t">
                    <td className="p-3 text-sm font-mono font-bold text-orange-600">{promo.code}</td>
                    <td className="p-3 text-sm">{promo.type === "fixed" ? "บาท" : "%"}</td>
                    <td className="p-3 text-sm text-right">{promo.value}{promo.type === "percent" ? "%" : " ฿"}</td>
                    <td className="p-3 text-sm text-right">{promo.minOrder} ฿</td>
                    <td className="p-3 text-sm text-right">{promo.usedCount || 0}/{promo.maxUses || 0}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${promo.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {promo.isActive ? "ใช้งาน" : "ปิด"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => removePromo(promo.id)} className="text-red-500 text-sm">ลบ</button>
                    </td>
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
