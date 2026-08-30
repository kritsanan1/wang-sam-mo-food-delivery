import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import Constants from "expo-constants";

const firebaseConfig = Constants.expoConfig?.extra?.firebaseConfig ?? {
  apiKey: "AIzaSyD4sWSZqHmHBK-47saTScpdtZ8XGHRGJ1Y",
  authDomain: "wang-sam-mo-food-delivery.firebaseapp.com",
  projectId: "wang-sam-mo-food-delivery",
  storageBucket: "wang-sam-mo-food-delivery.firebasestorage.app",
  messagingSenderId: "602447821203",
  appId: "1:602447821203:web:e1241cefeaf895291c5066",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
