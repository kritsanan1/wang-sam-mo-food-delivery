import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase-admin";

export default async function AdminDashboard() {
  const ordersSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(20)));
  const restaurantsSnap = await getDocs(collection(db, "restaurants"));
  const ridersSnap = await getDocs(collection(db, "riders"));

  const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const restaurants = restaurantsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const riders = ridersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-gray-500 text-sm">ร้านทั้งหมด</p>
          <p className="text-3xl font-bold text-primary">{restaurants.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-gray-500 text-sm">Rider ทั้งหมด</p>
          <p className="text-3xl font-bold text-secondary">{riders.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-gray-500 text-sm">คำสั่งล่าสุด</p>
          <p className="text-3xl font-bold text-dark">{orders.length}</p>
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
            {orders.map((order: any) => (
              <tr key={order.id} className="border-t">
                <td className="p-3 text-sm">#{order.id.slice(-6)}</td>
                <td className="p-3 text-sm">{order.restaurantName || "—"}</td>
                <td className="p-3 text-sm">{order.status}</td>
                <td className="p-3 text-sm text-right">{order.total} ฿</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
