import { Router } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('packages').get();
    const packages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
