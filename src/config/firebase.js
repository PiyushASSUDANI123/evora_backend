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
    reviews: []
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
