import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

const orderData = {
  tableNo: 5,
  items: [
    { id: '1', name: 'Test', price: 10, quantity: 2 }
  ],
  note: 'test note',
  subtotal: 20,
  total: 20,
  paymentMethod: 'cash',
  status: 'pending',
  createdAt: new Date().toISOString()
};

async function test() {
  try {
    await setDoc(doc(db, 'orders', 'ORD-12345'), orderData);
    console.log("Order saved successfully!");
  } catch(e) {
    console.error("Order save failed:", e);
  }
}

test();
