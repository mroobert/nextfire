import { initializeApp, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvZBCh-O4rVUrb-lD-gtJ1E1rUTnhWJPA",
  authDomain: "nextfire-6ee21.firebaseapp.com",
  projectId: "nextfire-6ee21",
  storageBucket: "nextfire-6ee21.appspot.com",
  messagingSenderId: "360876717063",
  appId: "1:360876717063:web:801e1fe3e593f2a329e6a2"
};

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

const firebaseApp = createFirebaseApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
export const storage = getStorage(firebaseApp);
export const store = getFirestore(firebaseApp);
