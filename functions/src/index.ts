import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface OrderData {
  customerId: string;
  restaurantId: string;
  riderId?: string;
  items: Array<{
    itemId: string;
    name: string;
    price: number;
    qty: number;
    options?: Array<{ name: string; price: number }>;
    notes?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  commission: number;
  status: string;
  deliveryAddress: string;
  customerPhone: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: admin.firestore.Timestamp;
  acceptedAt?: admin.firestore.Timestamp;
  pickedUpAt?: admin.firestore.Timestamp;
  deliveredAt?: admin.firestore.Timestamp;
}

// ============================================================
// 1. ON ORDER CREATE — ส่ง push หาร้าน + ตั้ง timeout auto-reject
// ============================================================

export const onOrderCreate = onDocumentCreated("orders/{orderId}", async (event) => {
  const orderId = event.params.orderId;
  const orderData = event.data?.data() as OrderData | undefined;

  if (!orderData) return;

  functions.logger.info(`New order ${orderId} for restaurant ${orderData.restaurantId}`);

  // ดึง FCM token ของร้าน
  const restaurantDoc = await db.collection("restaurants").doc(orderData.restaurantId).get();
  const restaurantData = restaurantDoc.data();
  const restaurantName = restaurantData?.name || "ร้านอาหาร";

  // ดึง FCM token ของ owner
  const ownerDoc = await db.collection("users").doc(restaurantData?.ownerUserId).get();
  const ownerFcmToken = ownerDoc.data()?.fcmToken;

  if (ownerFcmToken) {
    await sendPushNotification(ownerFcmToken, {
      title: `🍔 คำสั่งใหม่!`,
      body: `คำสั่ง #${orderId.slice(-6)} — ยอด ${orderData.total} บาท`,
      data: { type: "new_order", orderId, restaurantId: orderData.restaurantId },
    });
  }

  // บันทึก timeout reference สำหรับ auto-reject (3 นาที)
  await db.collection("orders").doc(orderId).set(
    {
      autoRejectAt: admin.firestore.Timestamp.fromMillis(
        Date.now() + 3 * 60 * 1000
      ),
    },
    { merge: true }
  );
});

// ============================================================
// 2. ON ORDER UPDATE — ส่ง push ตามสถานะ
// ============================================================

export const onOrderUpdate = onDocumentUpdated("orders/{orderId}", async (event) => {
  const orderId = event.params.orderId;
  const beforeData = event.data?.before.data() as OrderData;
  const afterData = event.data?.after.data() as OrderData;

  if (!beforeData || !afterData) return;
  if (beforeData.status === afterData.status) return;

  functions.logger.info(`Order ${orderId} status: ${beforeData.status} → ${afterData.status}`);

  const statusMessages: Record<string, { title: string; body: string }> = {
    accepted: { title: "✅ ร้านรับคำสั่งแล้ว", body: "กำลังเตรียมอาหารให้คุณ" },
    preparing: { title: "👨‍🍳 กำลังทำอาหาร", body: "ร้านกำลังเตรียมอาหารของคุณ" },
    ready: { title: "📦 พร้อมส่งแล้ว", body: "กำลังหาไรเดอร์มารับอาหาร" },
    picked_up: { title: "🛵 ไรเดอร์รับอาหารแล้ว", body: "กำลังนำส่งถึงคุณ" },
    delivered: { title: "🎉 ส่งถึงแล้ว", body: "ขอบคุณที่ใช้บริการ อย่าลืมให้คะแนนนะคะ" },
    cancelled: { title: "❌ คำสั่งถูกยกเลิก", body: "คำสั่งถูกยกเลิก ขออภัยในความไม่สะดวก" },
    rejected: { title: "❌ ร้านปฏิเสธคำสั่ง", body: "ร้านไม่สามารถรับคำสั่งนี้ได้ ขออภัยค่ะ" },
  };

  const message = statusMessages[afterData.status];
  if (!message) return;

  // ส่ง push หาลูกค้า
  if (afterData.customerId) {
    const customerDoc = await db.collection("users").doc(afterData.customerId).get();
    const customerFcmToken = customerDoc.data()?.fcmToken;
    if (customerFcmToken) {
      await sendPushNotification(customerFcmToken, {
        ...message,
        data: { type: "order_update", orderId, status: afterData.status },
      });
    }
  }

  // ถ้าสถานะ = ready → หา rider ใกล้เคียง
  if (afterData.status === "ready" && !afterData.riderId) {
    await findNearbyRiders(orderId, afterData);
  }

  // ถ้าสถานะ = picked_up → ส่ง push ร้าน + ลูกค้า
  if (afterData.status === "picked_up" && afterData.riderId) {
    const riderDoc = await db.collection("riders").doc(afterData.riderId).get();
    const riderName = riderDoc.data()?.name || "ไรเดอร์";
    const riderPhone = riderDoc.data()?.phone || "";

    // ส่ง push ร้าน
    const restaurantDoc = await db.collection("restaurants").doc(afterData.restaurantId).get();
    const ownerDoc = await db.collection("users").doc(restaurantDoc.data()?.ownerUserId).get();
    const ownerFcmToken = ownerDoc.data()?.fcmToken;
    if (ownerFcmToken) {
      await sendPushNotification(ownerFcmToken, {
        title: "🛵 ไรเดอร์รับอาหารแล้ว",
        body: `${riderName} รับอาหารไปส่งแล้ว`,
        data: { type: "rider_picked_up", orderId },
      });
    }
  }

  // ถ้าสถานะ = delivered → คำนวณคอมมิชชัน + รายได้ rider
  if (afterData.status === "delivered") {
    await handleOrderDelivered(orderId, afterData);
  }
});

// ============================================================
// 3. FIND NEARBY RIDERS — หา rider ใกล้ร้าน (Haversine)
// ============================================================

async function findNearbyRiders(orderId: string, orderData: OrderData) {
  const restaurantDoc = await db.collection("restaurants").doc(orderData.restaurantId).get();
  const restaurantGeo = restaurantDoc.data()?.geo;

  if (!restaurantGeo) {
    functions.logger.warn(`Restaurant ${orderData.restaurantId} has no geo location`);
    return;
  }

  // Query riders ที่ออนไลน์และไม่มีงานปัจจุบัน
  const ridersSnapshot = await db
    .collection("riders")
    .where("isOnline", "==", true)
    .where("currentOrderId", "==", null)
    .limit(10)
    .get();

  if (ridersSnapshot.empty) {
    functions.logger.info("No available riders found");
    // ส่ง push หา admin ว่าไม่มี rider
    return;
  }

  // คำนวณระยะทางและเรียง
  const ridersWithDistance: Array<{ id: string; distance: number; fcmToken?: string }> = [];

  for (const riderDoc of ridersSnapshot.docs) {
    const riderData = riderDoc.data();
    if (riderData.geo) {
      const distance = haversineDistance(
        restaurantGeo.lat,
        restaurantGeo.lng,
        riderData.geo.lat,
        riderData.geo.lng
      );
      // เก็บ rider ในระยะ 5 กม.
      if (distance <= 5) {
        const userDoc = await db.collection("users").doc(riderDoc.id).get();
        ridersWithDistance.push({
          id: riderDoc.id,
          distance,
          fcmToken: userDoc.data()?.fcmToken,
        });
      }
    }
  }

  // เรียงตามระยะทาง ใกล้→ไกล
  ridersWithDistance.sort((a, b) => a.distance - b.distance);

  // ส่ง push หา rider 3 คนแรก
  const topRiders = ridersWithDistance.slice(0, 3);

  for (const rider of topRiders) {
    if (rider.fcmToken) {
      await sendPushNotification(rider.fcmToken, {
        title: "🛵 งานส่งใหม่!",
        body: `ร้าน${restaurantDoc.data()?.name || ""} — ระยะ ${rider.distance.toFixed(1)} กม. ค่าส่ง ${orderData.deliveryFee} บาท`,
        data: {
          type: "new_job",
          orderId,
          restaurantId: orderData.restaurantId,
        },
      });
    }
  }

  // บันทึกรายการ rider ที่ส่ง push ไป
  await db.collection("orders").doc(orderId).set(
    {
      notifiedRiders: topRiders.map((r) => r.id),
      riderNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

// ============================================================
// 4. HANDLE ORDER DELIVERED — คอมมิชชัน + รายได้ rider
// ============================================================

async function handleOrderDelivered(orderId: string, orderData: OrderData) {
  const batch = db.batch();

  // อัปเดตสถิติร้าน
  const restaurantRef = db.collection("restaurants").doc(orderData.restaurantId);
  batch.set(
    restaurantRef,
    {
      totalOrders: admin.firestore.FieldValue.increment(1),
    },
    { merge: true }
  );

  // อัปเดตรายได้ rider (80% ค่าส่ง)
  if (orderData.riderId) {
    const riderRef = db.collection("riders").doc(orderData.riderId);
    batch.set(
      riderRef,
      {
        totalEarnings: admin.firestore.FieldValue.increment(orderData.deliveryFee * 0.8),
        totalDeliveries: admin.firestore.FieldValue.increment(1),
        currentOrderId: null,
      },
      { merge: true }
    );
  }

  // บันทึก transaction log
  const transactionRef = db.collection("transactions").doc();
  batch.set(transactionRef, {
    orderId,
    restaurantId: orderData.restaurantId,
    riderId: orderData.riderId || null,
    subtotal: orderData.subtotal,
    deliveryFee: orderData.deliveryFee,
    total: orderData.total,
    commission: orderData.commission,
    riderEarning: orderData.deliveryFee * 0.8,
    platformEarning: orderData.commission + orderData.deliveryFee * 0.2,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();
  functions.logger.info(`Order ${orderId} delivered. Commission: ${orderData.commission}`);
}

// ============================================================
// 5. AUTO REJECT — ถ้าร้านไม่กดรับภายใน 3 นาที
// ============================================================

export const autoRejectOrders = onSchedule("every 1 minutes", async () => {
  const now = admin.firestore.Timestamp.now();

  const pendingOrders = await db
    .collection("orders")
    .where("status", "==", "pending")
    .where("autoRejectAt", "<=", now)
    .get();

  const batch = db.batch();

  for (const orderDoc of pendingOrders.docs) {
    batch.update(orderDoc.ref, {
      status: "rejected",
      rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
      rejectReason: "auto_timeout",
    });

    // ส่ง push ลูกค้า
    const orderData = orderDoc.data() as OrderData;
    const customerDoc = await db.collection("users").doc(orderData.customerId).get();
    const customerFcmToken = customerDoc.data()?.fcmToken;
    if (customerFcmToken) {
      await sendPushNotification(customerFcmToken, {
        title: "❌ ร้านไม่รับคำสั่ง",
        body: "ร้านไม่ได้ตอบรับคำสั่งภายในเวลาที่กำหนด ขออภัยค่ะ",
        data: { type: "order_rejected", orderId: orderDoc.id },
      });
    }

    functions.logger.info(`Auto-rejected order ${orderDoc.id}`);
  }

  await batch.commit();
});

// ============================================================
// 6. PROMPTPAY WEBHOOK — อัปเดตสถานะการชำระ
// ============================================================

export const promptpayWebhook = onRequest(
  { cors: true },
  async (req, res) => {
    // TODO: เพิ่ม signature verification จาก payment gateway
    const { orderId, status, transactionId } = req.body;

    if (!orderId) {
      res.status(400).json({ error: "missing orderId" });
      return;
    }

    functions.logger.info(`PromptPay webhook: order ${orderId}, status ${status}`);

    await db.collection("orders").doc(orderId).set(
      {
        paymentStatus: status === "success" ? "paid" : "failed",
        paymentTransactionId: transactionId || null,
        paidAt: status === "success" ? admin.firestore.FieldValue.serverTimestamp() : null,
      },
      { merge: true }
    );

    res.json({ success: true });
  }
);

// ============================================================
// 7. UPDATE RIDER LOCATION — เก็บ GPS สำหรับ tracking
// ============================================================

export const updateRiderLocation = onRequest(
  { cors: true },
  async (req, res) => {
    const auth = req.headers.authorization;
    // TODO: verify auth token

    const { riderId, lat, lng } = req.body;
    if (!riderId || !lat || !lng) {
      res.status(400).json({ error: "missing required fields" });
      return;
    }

    await db.collection("riders").doc(riderId).set(
      {
        geo: { lat, lng },
        lastLocationUpdate: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.json({ success: true });
  }
);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function sendPushNotification(
  token: string,
  payload: { title: string; body: string; data?: Record<string, string> }
) {
  try {
    await messaging.send({
      token,
      notification: { title: payload.title, body: payload.body },
      data: payload.data || {},
      android: { priority: "high" },
      apns: {
        payload: {
          aps: { sound: "default", badge: 1 },
        },
      },
    });
  } catch (error) {
    functions.logger.error("Push notification failed:", error);
  }
}
