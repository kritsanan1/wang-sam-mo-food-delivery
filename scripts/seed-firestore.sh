#!/bin/bash
# Seed Firestore via Firebase CLI
set -e
PROJECT="wang-sam-mo-food-delivery"

echo "🌱 Seeding Firestore..."

# === RESTAURANTS ===
echo "  ✓ Restaurants..."

firebase firestore:set restaurants/rest_kuayteaw_pa_som --project $PROJECT --json '{"name":"ร้านก๋วยเตี๋ยวป้าสม","phone":"0812345678","address":"หมู่ 7 ต.วังสามหมอ อ.วังสามหมอ จ.อุดรธานี","geo":{"lat":17.0517,"lng":103.0985},"imageUrl":"https://images.unsplash.com/photo-1569718212165-3a8277d2d2d5?w=800","rating":4.5,"totalOrders":0,"isOpen":true,"deliveryFee":20,"minOrder":50,"categories":["ไทย","ก๋วยเตี๋ยว"],"commissionRate":0.12,"ownerUserId":"user_pa_som","status":"active"}' 2>/dev/null

firebase firestore:set restaurants/rest_khaomuem_yen --project $PROJECT --json '{"name":"ร้านข้าวมื้อเย็น","phone":"0823456789","address":"หมู่ 5 ต.วังสามหมอ อ.วังสามหมอ จ.อุดรธานี","geo":{"lat":17.0489,"lng":103.0956},"imageUrl":"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800","rating":4.2,"totalOrders":0,"isOpen":true,"deliveryFee":25,"minOrder":60,"categories":["ไทย","ข้าวต้ม"],"commissionRate":0.12,"ownerUserId":"user_khaomuem","status":"active"}' 2>/dev/null

firebase firestore:set restaurants/rest_gaiyang_nong --project $PROJECT --json '{"name":"ร้านไก่ย่างน้อง","phone":"0834567890","address":"ตลาดวังสามหมอ อ.วังสามหมอ จ.อุดรธานี","geo":{"lat":17.0523,"lng":103.1001},"imageUrl":"https://images.unsplash.com/photo-1598103442097-8b7ea94e484f?w=800","rating":4.7,"totalOrders":0,"isOpen":true,"deliveryFee":20,"minOrder":80,"categories":["ไทย","อีสาน","ปิ้งย่าง"],"commissionRate":0.12,"ownerUserId":"user_gaiyang","status":"active"}' 2>/dev/null

firebase firestore:set restaurants/rest_somtum_pui --project $PROJECT --json '{"name":"ร้านส้มตำปุ้ย","phone":"0845678901","address":"หน้า รพ.สต.วังสามหมอ อ.วังสามหมอ จ.อุดรธานี","geo":{"lat":17.0501,"lng":103.0978},"imageUrl":"https://images.unsplash.com/photo-1559054663-e8c232e19d7c?w=800","rating":4.3,"totalOrders":0,"isOpen":false,"deliveryFee":25,"minOrder":40,"categories":["อีสาน","ส้มตำ"],"commissionRate":0.12,"ownerUserId":"user_somtum","status":"active"}' 2>/dev/null

firebase firestore:set restaurants/rest_coffee_wang --project $PROJECT --json '{"name":"ร้านกาแฟวังสามหมอ","phone":"0856789012","address":"แยกวังสามหมอ อ.วังสามหมอ จ.อุดรธานี","geo":{"lat":17.0510,"lng":103.0990},"imageUrl":"https://images.unsplash.com/photo-1554118811-83e896c1550c?w=800","rating":4.8,"totalOrders":0,"isOpen":true,"deliveryFee":15,"minOrder":50,"categories":["เครื่องดื่ม","กาแฟ","ขนม"],"commissionRate":0.10,"ownerUserId":"user_coffee","status":"active"}' 2>/dev/null

# === MENUS ===
echo "  ✓ Menu items..."

# Restaurant 1: ก๋วยเตี๋ยวป้าสม
firebase firestore:set restaurants/rest_kuayteaw_pa_som/menu/item_001 --project $PROJECT --json '{"name":"ก๋วยเตี๋ยวเนื้อ","description":"เนื้อสดนุ่ม ซดน้ำซุบ","price":50,"category":"ก๋วยเตี๋ยว","isAvailable":true,"imageUrl":"","options":[{"name":"ขนาด","choices":[{"label":"ธรรมดา","priceAdd":0},{"label":"พิเศษ","priceAdd":10}]},{"name":"ระดับเผ็ด","choices":[{"label":"ไม่เผ็ด","priceAdd":0},{"label":"เผ็ดน้อย","priceAdd":0},{"label":"เผ็ดกลาง","priceAdd":0},{"label":"เผ็ดมาก","priceAdd":0}]}]}' 2>/dev/null

firebase firestore:set restaurants/rest_kuayteaw_pa_som/menu/item_002 --project $PROJECT --json '{"name":"ก๋วยเตี๋ยวหมู","description":"หมูนุ่ม ซดน้ำซุบ","price":45,"category":"ก๋วยเตี๋ยว","isAvailable":true,"imageUrl":"","options":[{"name":"ขนาด","choices":[{"label":"ธรรมดา","priceAdd":0},{"label":"พิเศษ","priceAdd":10}]}]}' 2>/dev/null

firebase firestore:set restaurants/rest_kuayteaw_pa_som/menu/item_003 --project $PROJECT --json '{"name":"ก๋วยเตี๋ยวตับ","description":"ตับสด ไม่มีกลิ่น","price":45,"category":"ก๋วยเตี๋ยว","isAvailable":true,"imageUrl":""}' 2>/dev/null

firebase firestore:set restaurants/rest_kuayteaw_pa_som/menu/item_004 --project $PROJECT --json '{"name":"เกี้ยวหมู","description":"เกี้ยวทำมือ ไส้หมู","price":55,"category":"ก๋วยเตี๋ยว","isAvailable":false,"imageUrl":""}' 2>/dev/null

# Restaurant 2: ข้าวมื้อเย็น
firebase firestore:set restaurants/rest_khaomuem_yen/menu/item_005 --project $PROJECT --json '{"name":"ข้าวต้มหมู","description":"ข้าวต้มร้อนๆ หมูนุ่ม","price":40,"category":"ข้าวต้ม","isAvailable":true,"imageUrl":""}' 2>/dev/null

firebase firestore:set restaurants/rest_khaomuem_yen/menu/item_006 --project $PROJECT --json '{"name":"ข้าวหมูแดง","description":"หมูแดงย่าง ข้าวร้อน","price":55,"category":"ข้าว","isAvailable":true,"imageUrl":""}' 2>/dev/null

firebase firestore:set restaurants/rest_khaomuem_yen/menu/item_007 --project $PROJECT --json '{"name":"ข้าวไก่ทอด","description":"ไก่ทอดกรอบ ข้าวเหนียว","price":50,"category":"ข้าว","isAvailable":true,"imageUrl":""}' 2>/dev/null

# Restaurant 3: ไก่ย่างน้อง
firebase firestore:set restaurants/rest_gaiyang_nong/menu/item_008 --project $PROJECT --json '{"name":"ไก่ย่าง","description":"ไก่ย่างถ่าน หอมเครื่องเทศ","price":120,"category":"ปิ้งย่าง","isAvailable":true,"imageUrl":"","options":[{"name":"ขนาด","choices":[{"label":"ครึ่งตัว","priceAdd":0},{"label":"1 ตัว","priceAdd":80}]}]}' 2>/dev/null

firebase firestore:set restaurants/rest_gaiyang_nong/menu/item_009 --project $PROJECT --json '{"name":"ส้มตำไก่ย่าง","description":"ส้มตำรสเด็ด ไก่ย่างนุ่ม","price":60,"category":"ส้มตำ","isAvailable":true,"imageUrl":""}' 2>/dev/null

firebase firestore:set restaurants/rest_gaiyang_nong/menu/item_010 --project $PROJECT --json '{"name":"ลาบหมู","description":"ลาบหมูอีสาน รสจัดจ้าน","price":70,"category":"อีสาน","isAvailable":true,"imageUrl":""}' 2>/dev/null

firebase firestore:set restaurants/rest_gaiyang_nong/menu/item_011 --project $PROJECT --json '{"name":"น้ำตกหมู","description":"น้ำตกหมูสด เผ็ดร้อน","price":70,"category":"อีสาน","isAvailable":true,"imageUrl":""}' 2>/dev/null

# Restaurant 4: ส้มตำปุ้ย
firebase firestore:set restaurants/rest_somtum_pui/menu/item_012 --project $PROJECT --json '{"name":"ส้มตำไทย","description":"ส้มตำปูปลาร้า","price":45,"category":"ส้มตำ","isAvailable":true,"imageUrl":""}' 2>/dev/null

firebase firestore:set restaurants/rest_somtum_pui/menu/item_013 --project $PROJECT --json '{"name":"ส้มตำปู","description":"ปูสด ตำใหม่","price":60,"category":"ส้มตำ","isAvailable":true,"imageUrl":""}' 2>/dev/null

firebase firestore:set restaurants/rest_somtum_pui/menu/item_014 --project $PROJECT --json '{"name":"ไก่ทอด","description":"ไก่ทอดกรอบนอกนุ่มใน","price":80,"category":"ทอด","isAvailable":true,"imageUrl":""}' 2>/dev/null

# Restaurant 5: กาแฟวังสามหมอ
firebase firestore:set restaurants/rest_coffee_wang/menu/item_015 --project $PROJECT --json '{"name":"เอสเปรสโซ","description":"กาแฟเข้มข้น คั่วสด","price":45,"category":"กาแฟ","isAvailable":true,"imageUrl":""}' 2>/dev/null

firebase firestore:set restaurants/rest_coffee_wang/menu/item_016 --project $PROJECT --json '{"name":"ลาเต้ร้อน","description":"นมสด กาแฟหอม","price":55,"category":"กาแฟ","isAvailable":true,"imageUrl":""}' 2>/dev/null

firebase firestore:set restaurants/rest_coffee_wang/menu/item_017 --project $PROJECT --json '{"name":"ชาเย็น","description":"ชาไทยเย็น หวานมัน","price":35,"category":"ชา","isAvailable":true,"imageUrl":""}' 2>/dev/null

firebase firestore:set restaurants/rest_coffee_wang/menu/item_018 --project $PROJECT --json '{"name":"โรตีสด","description":"โรตีทอดกรอบ ทาเนย","price":30,"category":"ขนม","isAvailable":true,"imageUrl":""}' 2>/dev/null

# === RIDERS ===
echo "  ✓ Riders..."

firebase firestore:set riders/rider_somchai --project $PROJECT --json '{"name":"สมชาย ใจดี","phone":"0891234567","vehicleType":"มอเตอร์ไซค์","isOnline":false,"currentOrderId":null,"geo":{"lat":17.0510,"lng":103.0980},"totalEarnings":0,"totalDeliveries":0,"rating":4.8,"status":"active"}' 2>/dev/null

firebase firestore:set riders/rider_nit --project $PROJECT --json '{"name":"นิตยา ส่งเร็ว","phone":"0892345678","vehicleType":"มอเตอร์ไซค์","isOnline":false,"currentOrderId":null,"geo":{"lat":17.0495,"lng":103.0967},"totalEarnings":0,"totalDeliveries":0,"rating":4.6,"status":"active"}' 2>/dev/null

firebase firestore:set riders/rider_boy --project $PROJECT --json '{"name":"บอย ไรเดอร์","phone":"0893456789","vehicleType":"มอเตอร์ไซค์","isOnline":false,"currentOrderId":null,"geo":{"lat":17.0520,"lng":103.0995},"totalEarnings":0,"totalDeliveries":0,"rating":4.9,"status":"active"}' 2>/dev/null

# === PROMOTIONS ===
echo "  ✓ Promotions..."

firebase firestore:set promotions/promo_welcome50 --project $PROJECT --json '{"code":"WELCOME50","type":"fixed","value":50,"minOrder":100,"maxUses":1000,"usedCount":0,"isActive":true}' 2>/dev/null

firebase firestore:set promotions/promo_freeship --project $PROJECT --json '{"code":"FREESHIP","type":"fixed","value":20,"minOrder":80,"maxUses":500,"usedCount":0,"isActive":true}' 2>/dev/null

echo "✅ Seed complete!"
echo "  - 5 restaurants"
echo "  - 18 menu items"
echo "  - 3 riders"
echo "  - 2 promotions"
