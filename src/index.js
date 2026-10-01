import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRouter from './routes/orders.js';
import menuRouter from './routes/menu.js';
import collabsRouter from './routes/collabs.js';
import reviewsRouter from './routes/reviews.js';
import packagesRouter from './routes/packages.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

import path from 'path';

app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));

app.use('/api/orders', ordersRouter);
app.use('/api/menu', menuRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/collabs', collabsRouter);
app.use('/api/reviews', reviewsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Evora Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
