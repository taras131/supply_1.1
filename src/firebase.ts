import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwSGhT06_KLrnWp9d5tomSyB8UYzWuAPE",
  authDomain: "supply-818fa.firebaseapp.com",
  projectId: "supply-818fa",
  storageBucket: "supply-818fa.appspot.com",
  messagingSenderId: "745407995128",
  appId: "1:745407995128:web:45a9fa649805f2bfefef0d",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore(app);
