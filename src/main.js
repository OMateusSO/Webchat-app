import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJaSmH2hZsR9ceKzhMLc1CZtHKSE7hVSM",
  authDomain: "projeto-z-e8d75.firebaseapp.com",
  projectId: "projeto-z-e8d75",
  storageBucket: "projeto-z-e8d75.firebasestorage.app",
  messagingSenderId: "1091271556454",
  appId: "1:1091271556454:web:a15e1ca026086aeda41ca7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

createApp(App).use(router).mount('#app')


