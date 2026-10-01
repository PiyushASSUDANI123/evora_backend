import { Router } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('menu').get();
    const menu = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const docRef = await db.collection('menu').add(req.body);
    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await db.collection('menu').doc(req.params.id).update(req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection('menu').doc(req.params.id).delete();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
