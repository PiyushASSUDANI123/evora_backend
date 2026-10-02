import 'dotenv/config';
import admin from 'firebase-admin';
import { db } from './src/config/firebase.js';

async function clearDb() {
  const collections = ['menu', 'packages', 'reviews', 'inquiries', 'collabs'];
  for (const col of collections) {
    try {
      const snapshot = await db.collection(col).get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log(`Cleared ${col}`);
    } catch (err) {
      console.log(`Error clearing ${col}:`, err.message);
    }
  }
  console.log('Database cleared!');
  process.exit(0);
}
clearDb();
