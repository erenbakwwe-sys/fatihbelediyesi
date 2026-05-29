import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDzKoAtEAOkTfCj6SSeQh6ee3fg-w47VqE',
  authDomain: 'fatih-belediyesi-ff77e.firebaseapp.com',
  projectId: 'fatih-belediyesi-ff77e',
  storageBucket: 'fatih-belediyesi-ff77e.firebasestorage.app',
  messagingSenderId: '579890410349',
  appId: '1:579890410349:web:8a896d5408fe85767aa064',
  measurementId: 'G-8X3Y8TXH6Z'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirebase() {
  try {
    console.log("Testing rewards read...");
    const snapshot = await getDocs(collection(db, 'rewards'));
    console.log(`Successfully read rewards. Count: ${snapshot.docs.length}`);
    
    console.log("Testing rewards write...");
    const testDoc = doc(db, 'rewards', 'TEST-' + Date.now());
    await setDoc(testDoc, {
      test: true,
      createdAt: new Date().toISOString()
    });
    console.log("Successfully wrote to rewards!");
    
    console.log("Testing calls write...");
    await addDoc(collection(db, 'calls'), {
      tableNo: 1,
      type: 'garson',
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    console.log("Successfully wrote to calls!");

  } catch(e) {
    console.error("Firebase Error:", e.message);
  }
  process.exit();
}

testFirebase();
