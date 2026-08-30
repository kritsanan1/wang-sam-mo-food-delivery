import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD4sWSZqHmHBK-47saTScpdtZ8XGHRGJ1Y",
  authDomain: "wang-sam-mo-food-delivery.firebaseapp.com",
  projectId: "wang-sam-mo-food-delivery",
  storageBucket: "wang-sam-mo-food-delivery.firebasestorage.app",
  messagingSenderId: "602447821203",
  appId: "1:602447821203:web:e1241cefeaf895291c5066",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
