import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAIF-6oUBLMa2J2fmk-GQp6-vvuUM1r18g",
    authDomain: "donutdoomarcade.firebaseapp.com",
    projectId: "donutdoomarcade",
    storageBucket: "donutdoomarcade.appspot.com",
    messagingSenderId: "232090199454",
    appId: "1:232090199454:web:b19e736f05a249c2dd228f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth, provider};