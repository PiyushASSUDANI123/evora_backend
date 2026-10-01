import { Router } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection('orders').add(orderData);
    res.status(201).json({ id: docRef.id, ...orderData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await db.collection('orders').doc(req.params.id).update({ status });
    res.json({ id: req.params.id, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
