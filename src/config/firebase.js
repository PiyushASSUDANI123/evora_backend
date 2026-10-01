import admin from 'firebase-admin';

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID || 'evora-92a98',
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
  client_email: process.env.FIREBASE_CLIENT_EMAIL || '',
  client_id: process.env.FIREBASE_CLIENT_ID || '',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
};

let isInitialized = false;

if (!admin.apps.length) {
  try {
    if (serviceAccount.private_key) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      isInitialized = true;
    } else {
      console.log('Firebase credentials missing, falling back to mock database');
    }
  } catch (error) {
    console.log('Firebase admin initialization failed:', error.message);
  }
}

// Very simple mock DB for local development when Firebase keys are missing
const mockDb = {
  data: {
    menu: [
      { id: '1', img: 'http://localhost:5001/images/menu-1.png', title: 'Cold Cocoa', price: '₹60', desc: 'Rich, chilled & creamy', badge: 'Bestseller', badgeType: 'star' },
      { id: '2', img: 'http://localhost:5001/images/menu-2.png', title: 'Coconut Milk', price: '₹50', desc: 'Light, cool & refreshing', badge: 'Customer Favourite', badgeType: 'heart' },
      { id: '3', img: 'http://localhost:5001/images/menu-3.png', title: 'Chatpata Mix', price: '₹50', desc: 'Crunchy, loaded & full of flavour', badge: 'Most Ordered', badgeType: 'flame' },
      { id: '4', img: 'http://localhost:5001/images/menu-4.png', title: 'Fruit Chaat', price: '₹60', desc: 'Fresh, colourful & zesty', badge: 'Fresh & Seasonal', badgeType: 'leaf' }
    ].map(m => ({ id: m.id, data: m })),
    packages: [
      { id: '1', name: 'Basic', price: '₹1,499', period: '/ month', isPopular: false, features: ['1 Reel / Week', 'In-Store Shoot', 'Story Mentions', 'Basic Editing'] },
      { id: '2', name: 'Standard', price: '₹2,499', period: '/ month', isPopular: true, features: ['2 Reels / Week', 'In-Store + Product Shots', 'Story Mentions', 'Custom Captions', 'Priority Scheduling'] },
      { id: '3', name: 'Pro', price: '₹3,999', period: '/ month', isPopular: false, features: ['3 Reels / Week', 'Creative Concept & Script', 'In-Store + Lifestyle Shoots', 'Story Mentions', 'Priority Support'] }
    ].map(p => ({ id: p.id, data: p })),
    reviews: [
      { id: '1', name: 'Kavya S.', rating: 5, text: "I've been visiting Evora Balotra for months now, and their cold cocoa is hands down the best in town. The ingredients are always fresh and it tastes amazing every single time.", isApproved: true, createdAt: new Date().toISOString() },
      { id: '2', name: 'Rohan M.', rating: 5, text: "The chatpata mix is my absolute favorite. It has the perfect balance of spices, and it's always served fresh. Great place to hang out with friends!", isApproved: true, createdAt: new Date().toISOString() },
      { id: '3', name: 'Pooja D.', rating: 5, text: "Highly recommend the fruit chaat. It's incredibly fresh, very healthy, and they use a great variety of fruits. The staff is also very friendly and welcoming.", isApproved: false, createdAt: new Date().toISOString() }
    ].map(r => ({ id: r.id, data: r }))
  },
  collection: function(colName) {
    if (!this.data[colName]) this.data[colName] = [];
    const col = this.data[colName];
    return {
      get: async () => ({ docs: col.map(d => ({ id: d.id, data: () => d.data })) }),
      add: async (data) => {
        const id = Math.random().toString(36).substr(2, 9);
        col.push({ id, data });
        return { id };
      },
      doc: (id) => ({
        update: async (updates) => {
          const doc = col.find(d => d.id === id);
          if (doc) doc.data = { ...doc.data, ...updates };
        },
        delete: async () => {
          const index = col.findIndex(d => d.id === id);
          if (index > -1) col.splice(index, 1);
        }
      }),
      orderBy: function() { return this; },
      where: function(field, op, val) {
        return {
          get: async () => {
            const filtered = col.filter(d => {
              if (op === '==') return d.data[field] === val;
              return true;
            });
            return { docs: filtered.map(d => ({ id: d.id, data: () => d.data })) };
          }
        };
      }
    };
  }
};

export const db = isInitialized ? admin.firestore() : mockDb;
export default admin;
