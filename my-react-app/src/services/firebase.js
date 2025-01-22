import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getBusyDates = async () => {
  const busyDatesRef = collection(db, 'busyDates');
  const snapshot = await getDocs(busyDatesRef);
  return snapshot.docs.map(doc => doc.data().date.toDate());
};