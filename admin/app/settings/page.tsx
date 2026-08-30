"use client";

export default function AdminSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ตั้งค่า</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">ตั้งค่าแพลตฟอร์ม</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">ค่าคอมมิชชันเริ่มต้น (%)</label>
            <input className="w-full border rounded-lg p-2 text-sm" defaultValue="12" type="number" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">ค่าส่งเริ่มต้น (บาท)</label>
            <input className="w-full border rounded-lg p-2 text-sm" defaultValue="25" type="number" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">เวลา auto-reject (นาที)</label>
            <input className="w-full border rounded-lg p-2 text-sm" defaultValue="3" type="number" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">ระยะ rider รับงาน (กม.)</label>
            <input className="w-full border rounded-lg p-2 text-sm" defaultValue="5" type="number" />
          </div>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
