import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDHtEuw2RofncTiU2-Omp1X1wSqJazLwSU",
    authDomain: "kevin-app-f9f36.firebaseapp.com",
    projectId: "kevin-app-f9f36",
    storageBucket: "kevin-app-f9f36.appspot.com",
    messagingSenderId: "1009413746647",
    appId: "1:1009413746647:web:52bfe1dfa31ce3098d6592"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
export const analytics = getAnalytics(app);

