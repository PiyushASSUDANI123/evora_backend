import { Router } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

// GET all reviews (for admin)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').orderBy('createdAt', 'desc').get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET approved reviews (for website)
router.get('/approved', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').where('isApproved', '==', true).get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new review
router.post('/', async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      isApproved: true, // Auto-approve by default as requested
      createdAt: new Date().toISOString()
    };
    const docRef = await db.collection('reviews').add(reviewData);
    res.status(201).json({ id: docRef.id, ...reviewData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT (Approve/Update a review)
router.put('/:id', async (req, res) => {
  try {
    await db.collection('reviews').doc(req.params.id).update(req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a review
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('reviews').doc(req.params.id).delete();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
