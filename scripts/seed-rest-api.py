#!/usr/bin/env python3
"""Seed Firestore via REST API using Firebase CLI's access token."""
import json, os, sys, time
import urllib.request

# Load access token from Firebase CLI config
config_path = os.path.expanduser("~/.config/configstore/firebase-tools.json")
with open(config_path) as f:
    config = json.load(f)
token = config["tokens"]["access_token"]

PROJECT = "wang-sam-mo-food-delivery"
BASE_URL = f"https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents"

def create_doc(path, data):
    """Create or update a document at the given path."""
    url = f"{BASE_URL}/{path}"
    # Convert JSON to Firestore format
    fields = {}
    for key, value in data.items():
        fields[key] = json_to_firestore(value)
    
    body = json.dumps({"fields": fields}).encode()
    req = urllib.request.Request(url, data=body, method="PATCH")
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return True
    except Exception as e:
        print(f"  ERROR: {e}", file=sys.stderr)
        return False

def json_to_firestore(value):
    """Convert Python value to Firestore Value format."""
    if isinstance(value, bool):
        return {"booleanValue": value}
    elif isinstance(value, int):
        return {"integerValue": str(value)}
    elif isinstance(value, float):
        return {"doubleValue": value}
    elif isinstance(value, str):
        return {"stringValue": value}
    elif isinstance(value, list):
        return {"arrayValue": {"values": [json_to_firestore(v) for v in value]}}
    elif isinstance(value, dict):
        return {"mapValue": {"fields": {k: json_to_firestore(v) for k, v in value.items()}}}
    elif value is None:
        return {"nullValue": None}
    return {"stringValue": str(value)}

# ============================================================
# RESTAURANTS
# ============================================================
restaurants = [
    ("rest_kuayteaw_pa_som", {"name": "ร้านก๋วยเตี๋ยวป้าสม", "phone": "0812345678", "address": "หมู่ 7 ต.วังสามหมอ อ.วังสามหมอ จ.อุดรธานี", "geo": {"lat": 17.0517, "lng": 103.0985}, "imageUrl": "https://images.unsplash.com/photo-1569718212165-3a8277d2d2d5?w=800", "rating": 4.5, "totalOrders": 0, "isOpen": True, "deliveryFee": 20, "minOrder": 50, "categories": ["ไทย", "ก๋วยเตี๋ยว"], "commissionRate": 0.12, "ownerUserId": "user_pa_som", "status": "active"}),
    ("rest_khaomuem_yen", {"name": "ร้านข้าวมื้อเย็น", "phone": "0823456789", "address": "หมู่ 5 ต.วังสามหมอ อ.วังสามหมอ จ.อุดรธานี", "geo": {"lat": 17.0489, "lng": 103.0956}, "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800", "rating": 4.2, "totalOrders": 0, "isOpen": True, "deliveryFee": 25, "minOrder": 60, "categories": ["ไทย", "ข้าวต้ม"], "commissionRate": 0.12, "ownerUserId": "user_khaomuem", "status": "active"}),
    ("rest_gaiyang_nong", {"name": "ร้านไก่ย่างน้อง", "phone": "0834567890", "address": "ตลาดวังสามหมอ อ.วังสามหมอ จ.อุดรธานี", "geo": {"lat": 17.0523, "lng": 103.1001}, "imageUrl": "https://images.unsplash.com/photo-1598103442097-8b7ea94e484f?w=800", "rating": 4.7, "totalOrders": 0, "isOpen": True, "deliveryFee": 20, "minOrder": 80, "categories": ["ไทย", "อีสาน", "ปิ้งย่าง"], "commissionRate": 0.12, "ownerUserId": "user_gaiyang", "status": "active"}),
    ("rest_somtum_pui", {"name": "ร้านส้มตำปุ้ย", "phone": "0845678901", "address": "หน้า รพ.สต.วังสามหมอ อ.วังสามหมอ จ.อุดรธานี", "geo": {"lat": 17.0501, "lng": 103.0978}, "imageUrl": "https://images.unsplash.com/photo-1559054663-e8c232e19d7c?w=800", "rating": 4.3, "totalOrders": 0, "isOpen": False, "deliveryFee": 25, "minOrder": 40, "categories": ["อีสาน", "ส้มตำ"], "commissionRate": 0.12, "ownerUserId": "user_somtum", "status": "active"}),
    ("rest_coffee_wang", {"name": "ร้านกาแฟวังสามหมอ", "phone": "0856789012", "address": "แยกวังสามหมอ อ.วังสามหมอ จ.อุดรธานี", "geo": {"lat": 17.0510, "lng": 103.0990}, "imageUrl": "https://images.unsplash.com/photo-1554118811-83e896c1550c?w=800", "rating": 4.8, "totalOrders": 0, "isOpen": True, "deliveryFee": 15, "minOrder": 50, "categories": ["เครื่องดื่ม", "กาแฟ", "ขนม"], "commissionRate": 0.10, "ownerUserId": "user_coffee", "status": "active"}),
]

# ============================================================
# MENUS
# ============================================================
menus = {
    "rest_kuayteaw_pa_som": [
        ("item_001", {"name": "ก๋วยเตี๋ยวเนื้อ", "description": "เนื้อสดนุ่ม ซดน้ำซุบ", "price": 50, "category": "ก๋วยเตี๋ยว", "isAvailable": True, "imageUrl": "", "options": [{"name": "ขนาด", "choices": [{"label": "ธรรมดา", "priceAdd": 0}, {"label": "พิเศษ", "priceAdd": 10}]}, {"name": "ระดับเผ็ด", "choices": [{"label": "ไม่เผ็ด", "priceAdd": 0}, {"label": "เผ็ดน้อย", "priceAdd": 0}, {"label": "เผ็ดกลาง", "priceAdd": 0}, {"label": "เผ็ดมาก", "priceAdd": 0}]}]}),
        ("item_002", {"name": "ก๋วยเตี๋ยวหมู", "description": "หมูนุ่ม ซดน้ำซุบ", "price": 45, "category": "ก๋วยเตี๋ยว", "isAvailable": True, "imageUrl": "", "options": [{"name": "ขนาด", "choices": [{"label": "ธรรมดา", "priceAdd": 0}, {"label": "พิเศษ", "priceAdd": 10}]}]}),
        ("item_003", {"name": "ก๋วยเตี๋ยวตับ", "description": "ตับสด ไม่มีกลิ่น", "price": 45, "category": "ก๋วยเตี๋ยว", "isAvailable": True, "imageUrl": ""}),
        ("item_004", {"name": "เกี้ยวหมู", "description": "เกี้ยวทำมือ ไส้หมู", "price": 55, "category": "ก๋วยเตี๋ยว", "isAvailable": False, "imageUrl": ""}),
    ],
    "rest_khaomuem_yen": [
        ("item_005", {"name": "ข้าวต้มหมู", "description": "ข้าวต้มร้อนๆ หมูนุ่ม", "price": 40, "category": "ข้าวต้ม", "isAvailable": True, "imageUrl": ""}),
        ("item_006", {"name": "ข้าวหมูแดง", "description": "หมูแดงย่าง ข้าวร้อน", "price": 55, "category": "ข้าว", "isAvailable": True, "imageUrl": ""}),
        ("item_007", {"name": "ข้าวไก่ทอด", "description": "ไก่ทอดกรอบ ข้าวเหนียว", "price": 50, "category": "ข้าว", "isAvailable": True, "imageUrl": ""}),
    ],
    "rest_gaiyang_nong": [
        ("item_008", {"name": "ไก่ย่าง", "description": "ไก่ย่างถ่าน หอมเครื่องเทศ", "price": 120, "category": "ปิ้งย่าง", "isAvailable": True, "imageUrl": "", "options": [{"name": "ขนาด", "choices": [{"label": "ครึ่งตัว", "priceAdd": 0}, {"label": "1 ตัว", "priceAdd": 80}]}]}),
        ("item_009", {"name": "ส้มตำไก่ย่าง", "description": "ส้มตำรสเด็ด ไก่ย่างนุ่ม", "price": 60, "category": "ส้มตำ", "isAvailable": True, "imageUrl": ""}),
        ("item_010", {"name": "ลาบหมู", "description": "ลาบหมูอีสาน รสจัดจ้าน", "price": 70, "category": "อีสาน", "isAvailable": True, "imageUrl": ""}),
        ("item_011", {"name": "น้ำตกหมู", "description": "น้ำตกหมูสด เผ็ดร้อน", "price": 70, "category": "อีสาน", "isAvailable": True, "imageUrl": ""}),
    ],
    "rest_somtum_pui": [
        ("item_012", {"name": "ส้มตำไทย", "description": "ส้มตำปูปลาร้า", "price": 45, "category": "ส้มตำ", "isAvailable": True, "imageUrl": ""}),
        ("item_013", {"name": "ส้มตำปู", "description": "ปูสด ตำใหม่", "price": 60, "category": "ส้มตำ", "isAvailable": True, "imageUrl": ""}),
        ("item_014", {"name": "ไก่ทอด", "description": "ไก่ทอดกรอบนอกนุ่มใน", "price": 80, "category": "ทอด", "isAvailable": True, "imageUrl": ""}),
    ],
    "rest_coffee_wang": [
        ("item_015", {"name": "เอสเปรสโซ", "description": "กาแฟเข้มข้น คั่วสด", "price": 45, "category": "กาแฟ", "isAvailable": True, "imageUrl": ""}),
        ("item_016", {"name": "ลาเต้ร้อน", "description": "นมสด กาแฟหอม", "price": 55, "category": "กาแฟ", "isAvailable": True, "imageUrl": ""}),
        ("item_017", {"name": "ชาเย็น", "description": "ชาไทยเย็น หวานมัน", "price": 35, "category": "ชา", "isAvailable": True, "imageUrl": ""}),
        ("item_018", {"name": "โรตีสด", "description": "โรตีทอดกรอบ ทาเนย", "price": 30, "category": "ขนม", "isAvailable": True, "imageUrl": ""}),
    ],
}

# ============================================================
# RIDERS
# ============================================================
riders = [
    ("rider_somchai", {"name": "สมชาย ใจดี", "phone": "0891234567", "vehicleType": "มอเตอร์ไซค์", "isOnline": False, "currentOrderId": None, "geo": {"lat": 17.0510, "lng": 103.0980}, "totalEarnings": 0, "totalDeliveries": 0, "rating": 4.8, "status": "active"}),
    ("rider_nit", {"name": "นิตยา ส่งเร็ว", "phone": "0892345678", "vehicleType": "มอเตอร์ไซค์", "isOnline": False, "currentOrderId": None, "geo": {"lat": 17.0495, "lng": 103.0967}, "totalEarnings": 0, "totalDeliveries": 0, "rating": 4.6, "status": "active"}),
    ("rider_boy", {"name": "บอย ไรเดอร์", "phone": "0893456789", "vehicleType": "มอเตอร์ไซค์", "isOnline": False, "currentOrderId": None, "geo": {"lat": 17.0520, "lng": 103.0995}, "totalEarnings": 0, "totalDeliveries": 0, "rating": 4.9, "status": "active"}),
]

# ============================================================
# PROMOTIONS
# ============================================================
promotions = [
    ("promo_welcome50", {"code": "WELCOME50", "type": "fixed", "value": 50, "minOrder": 100, "maxUses": 1000, "usedCount": 0, "isActive": True}),
    ("promo_freeship", {"code": "FREESHIP", "type": "fixed", "value": 20, "minOrder": 80, "maxUses": 500, "usedCount": 0, "isActive": True}),
]

# ============================================================
# SEED
# ============================================================
print("🌱 Seeding Firestore via REST API...")
success = 0
fail = 0

# Restaurants
print("  Restaurants...")
for doc_id, data in restaurants:
    if create_doc(f"restaurants/{doc_id}", data):
        success += 1
        print(f"    ✓ {data['name']}")
    else:
        fail += 1

# Menus
print("  Menu items...")
for rest_id, items in menus.items():
    for doc_id, data in items:
        if create_doc(f"restaurants/{rest_id}/menu/{doc_id}", data):
            success += 1
        else:
            fail += 1
print(f"    ✓ {sum(len(v) for v in menus.values())} items")

# Riders
print("  Riders...")
for doc_id, data in riders:
    if create_doc(f"riders/{doc_id}", data):
        success += 1
        print(f"    ✓ {data['name']}")
    else:
        fail += 1

# Promotions
print("  Promotions...")
for doc_id, data in promotions:
    if create_doc(f"promotions/{doc_id}", data):
        success += 1
        print(f"    ✓ {data['code']}")
    else:
        fail += 1

print(f"\n✅ Seed complete! {success} succeeded, {fail} failed")
print(f"  - 5 restaurants")
print(f"  - 18 menu items")
print(f"  - 3 riders")
print(f"  - 2 promotions")
