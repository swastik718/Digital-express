// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBStOQ8WzxIA-ldk4XAMx0rLmgR8o1yuvI",
//   authDomain: "digital-express-192cb.firebaseapp.com",
//   projectId: "digital-express-192cb",
//   storageBucket: "digital-express-192cb.appspot.com",  // ✅ FIXED
//   messagingSenderId: "1097600069645",
//   appId: "1:1097600069645:web:d8cf65dc1209b187962544",
//   measurementId: "G-X7LJTL1023"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
// getAnalytics(app);


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "digital-express-e4d76.firebaseapp.com",
  projectId: "digital-express-e4d76",
  storageBucket: "digital-express-e4d76.firebasestorage.app",
  messagingSenderId: "847821462132",
  appId: "1:847821462132:web:61a16d837870c6b5740f21",
  measurementId: "G-D5DLPMMC4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
getAnalytics(app);