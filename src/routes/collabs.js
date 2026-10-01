import { Router } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('collabs').orderBy('createdAt', 'desc').get();
    const collabs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(collabs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const collabData = {
      ...req.body,
      status: 'Unread',
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection('collabs').add(collabData);
    res.status(201).json({ id: docRef.id, ...collabData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    await db.collection('collabs').doc(req.params.id).update(req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection('collabs').doc(req.params.id).delete();
    res.json({ message: 'Collab request deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
