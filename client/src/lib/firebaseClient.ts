// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5SaI-M88HXPNVFg66AOQBvX-eI8B-_H0",
  authDomain: "datashop-1.firebaseapp.com",
  projectId: "datashop-1",
  storageBucket: "datashop-1.appspot.app",
  messagingSenderId: "69967607455",
  appId: "1:69967607455:web:265c24002c6ad52d4f14aa",
  measurementId: "G-JXZJH5E460"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };