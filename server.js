import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database file (use persistent disk path if provided by Render)
const dbPath = process.env.DB_PATH || path.join(__dirname, 'campus_lost_found.db');
const db = new Database(dbPath);

console.log(`[SQLite Database] Connected to SQLite database file at: ${dbPath}`);

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    imageUrl TEXT,
    status TEXT NOT NULL DEFAULT 'approved',
    reportedBy TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS claims (
    id TEXT PRIMARY KEY,
    itemId TEXT NOT NULL,
    itemTitle TEXT NOT NULL,
    claimantName TEXT NOT NULL,
    claimantEmail TEXT NOT NULL,
    claimantPhone TEXT,
    collegeId TEXT,
    proofDetails TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    submittedAt TEXT NOT NULL,
    FOREIGN KEY (itemId) REFERENCES items (id) ON DELETE CASCADE
  );
`);

// Initial 15 Seed Items
const INITIAL_ITEMS = [
  {
    id: 'item-101',
    title: '65W USB-C Laptop Charger',
    type: 'lost',
    category: 'Electronics',
    description: 'Black USB-C fast charger with a slightly coiled thick braided cable. Left on a corner study desk near the second floor silent zone.',
    location: 'Central Library, 2nd Floor',
    date: '2026-09-29',
    imageUrl: '/src/assets/images/lost_laptop_charger_1790874005031.jpg',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_student_01',
      name: 'Alex Johnson',
      email: 'alex.j@college.edu',
      department: 'Computer Science',
    }),
    createdAt: '2026-09-29T14:30:00Z',
  },
  {
    id: 'item-102',
    title: 'Blue Metal Water Bottle',
    type: 'found',
    category: 'Other',
    description: 'Matte dark navy insulated water bottle with a small campus robotics club sticker on the base. Found on table #4.',
    location: 'Campus Cafeteria, Hall B',
    date: '2026-09-30',
    imageUrl: '/src/assets/images/lost_water_bottle_1790874018368.jpg',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_student_02',
      name: 'Rohan Sharma',
      email: 'rohan.s@college.edu',
      department: 'Mechanical Engineering',
    }),
    createdAt: '2026-09-30T11:15:00Z',
  },
  {
    id: 'item-103',
    title: 'Blue Lanyard with Student ID & Keys',
    type: 'found',
    category: 'Keys & Accessories',
    description: 'Royal blue campus lanyard with clear plastic badge sleeve containing student ID and two brass dorm door keys attached to ring.',
    location: 'Science Block, Room 302',
    date: '2026-10-01',
    imageUrl: '/src/assets/images/lost_student_id_keys_1790874036797.jpg',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_staff_01',
      name: 'Prof. David Miller',
      email: 'd.miller@college.edu',
      department: 'Physics Faculty',
    }),
    createdAt: '2026-10-01T08:45:00Z',
  },
  {
    id: 'item-104',
    title: 'TI-84 Plus Graphing Calculator',
    type: 'lost',
    category: 'Electronics',
    description: 'Dark grey graphing calculator with sliding hard cover. Has a tiny white initials mark "S.V." on battery compartment cover.',
    location: 'Lecture Hall 101, Row 5',
    date: '2026-09-28',
    imageUrl: '/src/assets/images/lost_graphing_calc_1790874049756.jpg',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_student_01',
      name: 'Alex Johnson',
      email: 'alex.j@college.edu',
      department: 'Computer Science',
    }),
    createdAt: '2026-09-28T16:00:00Z',
  },
  {
    id: 'item-105',
    title: 'Apple AirPods Pro (2nd Gen)',
    type: 'lost',
    category: 'Electronics',
    description: 'White AirPods Pro charging case with custom engraving "A.V.". Left accidentally on the couch near the student lounge entrance.',
    location: 'Student Center & Canteen',
    date: '2026-10-01',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_student_03',
      name: 'Ananya Verma',
      email: 'ananya.v@college.edu',
      department: 'Biotechnology',
    }),
    createdAt: '2026-10-01T10:20:00Z',
  },
  {
    id: 'item-106',
    title: 'Black North Face Backpack',
    type: 'found',
    category: 'Bags & Backpacks',
    description: 'Heavy duty black North Face backpack containing lab notebooks and a silver water bottle. Left under the bench in Computer Lab 3.',
    location: 'Computer Lab 3',
    date: '2026-09-30',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_staff_02',
      name: 'Lab Admin Kevin',
      email: 'kevin.lab@college.edu',
      department: 'IT Infrastructure',
    }),
    createdAt: '2026-09-30T17:40:00Z',
  },
  {
    id: 'item-107',
    title: 'Brown Leather Wallet & Driving License',
    type: 'lost',
    category: 'ID & Cards',
    description: 'Dark brown bifold leather wallet containing college student ID card, state license, and metro transit card. Lost somewhere near East Campus parking.',
    location: 'East Campus Parking',
    date: '2026-09-29',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_student_04',
      name: 'Michael Chang',
      email: 'michael.c@college.edu',
      department: 'Business Administration',
    }),
    createdAt: '2026-09-29T19:10:00Z',
  },
  {
    id: 'item-108',
    title: 'Ray-Ban Classic Aviator Sunglasses',
    type: 'found',
    category: 'Keys & Accessories',
    description: 'Gold-framed Ray-Ban aviator sunglasses with green tinted lenses. Found on the bleachers during afternoon basketball session.',
    location: 'Sports Complex & Gym',
    date: '2026-10-01',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_student_05',
      name: 'Priya Patel',
      email: 'priya.p@college.edu',
      department: 'Sports Science',
    }),
    createdAt: '2026-10-01T15:00:00Z',
  },
  {
    id: 'item-109',
    title: 'Organic Chemistry 8th Edition Textbook',
    type: 'lost',
    category: 'Books & Notes',
    description: 'Hardcover textbook with yellow sticky notes on Chapter 4 & 5. Left on desk #12 in 1st floor reading hall.',
    location: 'Central Library, 1st Floor',
    date: '2026-09-27',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_student_06',
      name: 'Emily Davis',
      email: 'emily.d@college.edu',
      department: 'Chemistry',
    }),
    createdAt: '2026-09-27T13:00:00Z',
  },
  {
    id: 'item-110',
    title: 'Grey Campus Varsity Hoodie (Size M)',
    type: 'found',
    category: 'Clothing',
    description: 'Grey zip-up hooded sweatshirt with university logo embroidered on chest. Found on chair in auditorium after guest lecture.',
    location: 'Main Administrative Building',
    date: '2026-09-30',
    imageUrl: '/src/assets/images/campus_hoodie.png',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_staff_03',
      name: 'Sarah Connor',
      email: 's.connor@college.edu',
      department: 'Campus Safety',
    }),
    createdAt: '2026-09-30T18:30:00Z',
  },
  {
    id: 'item-111',
    title: 'Logitech MX Master 3S Mouse',
    type: 'lost',
    category: 'Electronics',
    description: 'Graphite wireless ergonomic mouse with thumb scroll wheel. Left connected to charging cable at desk in quad plaza.',
    location: 'Engineering Quad',
    date: '2026-10-01',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_student_01',
      name: 'Alex Johnson',
      email: 'alex.j@college.edu',
      department: 'Computer Science',
    }),
    createdAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'item-112',
    title: 'Amazon Kindle Paperwhite (Black Cover)',
    type: 'found',
    category: 'Electronics',
    description: '6.8" E-reader with a black magnetic leather folding case. Found on bench outside Science Block.',
    location: 'Science Block, Room 302',
    date: '2026-09-29',
    imageUrl: '/src/assets/images/kindle_ereader.png',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_student_07',
      name: 'Liam Wilson',
      email: 'liam.w@college.edu',
      department: 'English Literature',
    }),
    createdAt: '2026-09-29T16:45:00Z',
  },
  {
    id: 'item-113',
    title: 'Subaru Key Fob with Gym Keychain',
    type: 'lost',
    category: 'Keys & Accessories',
    description: 'Black electronic remote key fob with key blade folded out. Has a neon orange campus gym member tag attached.',
    location: 'East Campus Parking',
    date: '2026-09-30',
    imageUrl: '/src/assets/images/car_key_fob.png',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_student_08',
      name: 'Jessica Taylor',
      email: 'jessica.t@college.edu',
      department: 'Civil Engineering',
    }),
    createdAt: '2026-09-30T09:00:00Z',
  },
  {
    id: 'item-114',
    title: 'Hydro Flask 32oz Insulated Bottle',
    type: 'lost',
    category: 'Other',
    description: 'Olive green Hydro Flask insulated flask with straw lid and several National Park vinyl stickers on side.',
    location: 'Sports Complex & Gym',
    date: '2026-10-01',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_student_09',
      name: 'Daniel Martinez',
      email: 'daniel.m@college.edu',
      department: 'Kinesiology',
    }),
    createdAt: '2026-10-01T14:15:00Z',
  },
  {
    id: 'item-115',
    title: 'Anker 20,000mAh Power Bank',
    type: 'found',
    category: 'Electronics',
    description: 'Matte black heavy duty portable power bank with dual USB output ports. Left plugged into charging station.',
    location: 'Student Center & Canteen',
    date: '2026-09-28',
    imageUrl: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({
      id: 'usr_staff_04',
      name: 'Canteen Supervisor Ray',
      email: 'ray.canteen@college.edu',
      department: 'Campus Dining',
    }),
    createdAt: '2026-09-28T18:00:00Z',
  },
];

function seedDatabase() {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM items');
  const { count } = countStmt.get();

  if (count === 0) {
    console.log('[SQLite Database] Seeding database with 15 initial campus items...');
    const insertStmt = db.prepare(`
      INSERT INTO items (id, title, type, category, description, location, date, imageUrl, status, reportedBy, createdAt)
      VALUES (@id, @title, @type, @category, @description, @location, @date, @imageUrl, @status, @reportedBy, @createdAt)
    `);

    const insertMany = db.transaction((items) => {
      for (const item of items) insertStmt.run(item);
    });

    insertMany(INITIAL_ITEMS);
    console.log('[SQLite Database] Successfully seeded 15 items into campus_lost_found.db!');
  }
}

seedDatabase();

// --- REST API ENDPOINTS ---

// 1. GET /api/items - Retrieve all items
app.get('/api/items', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM items ORDER BY createdAt DESC');
    const rows = stmt.all();
    const items = rows.map((r) => ({
      ...r,
      reportedBy: r.reportedBy ? JSON.parse(r.reportedBy) : null,
    }));
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    console.error('[API Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST /api/items - Add a new item
app.post('/api/items', (req, res) => {
  try {
    const { title, type, category, description, location, date, imageUrl, reportedBy } = req.body;
    const newItem = {
      id: `item-${Date.now()}`,
      title,
      type,
      category,
      description: description || '',
      location,
      date,
      imageUrl: imageUrl || '',
      status: 'active',
      reportedBy: JSON.stringify(reportedBy || { name: 'Student', email: 'student@college.edu' }),
      createdAt: new Date().toISOString(),
    };

    const stmt = db.prepare(`
      INSERT INTO items (id, title, type, category, description, location, date, imageUrl, status, reportedBy, createdAt)
      VALUES (@id, @title, @type, @category, @description, @location, @date, @imageUrl, @status, @reportedBy, @createdAt)
    `);
    stmt.run(newItem);

    const created = {
      ...newItem,
      reportedBy: JSON.parse(newItem.reportedBy),
    };
    res.status(201).json({ success: true, item: created });
  } catch (err) {
    console.error('[API Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. PUT /api/items/:id - Update an item
app.put('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fields = [];
    const values = { id };

    for (const [key, val] of Object.entries(updates)) {
      if (key !== 'id') {
        fields.push(`${key} = @${key}`);
        values[key] = key === 'reportedBy' ? JSON.stringify(val) : val;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields provided to update.' });
    }

    const stmt = db.prepare(`UPDATE items SET ${fields.join(', ')} WHERE id = @id`);
    stmt.run(values);

    res.json({ success: true, message: `Item ${id} updated successfully.` });
  } catch (err) {
    console.error('[API Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. DELETE /api/items/:id - Delete an item
app.delete('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM items WHERE id = ?');
    stmt.run(id);
    res.json({ success: true, message: `Item ${id} deleted successfully.` });
  } catch (err) {
    console.error('[API Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. GET /api/claims - Retrieve claims
app.get('/api/claims', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM claims ORDER BY submittedAt DESC');
    const claims = stmt.all();
    res.json({ success: true, count: claims.length, claims });
  } catch (err) {
    console.error('[API Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST /api/claims - Submit a claim
app.post('/api/claims', (req, res) => {
  try {
    const { itemId, itemTitle, claimantName, claimantEmail, claimantPhone, collegeId, proofDetails } = req.body;
    const newClaim = {
      id: `claim-${Date.now()}`,
      itemId,
      itemTitle,
      claimantName,
      claimantEmail,
      claimantPhone: claimantPhone || '',
      collegeId: collegeId || '',
      proofDetails,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const stmt = db.prepare(`
      INSERT INTO claims (id, itemId, itemTitle, claimantName, claimantEmail, claimantPhone, collegeId, proofDetails, status, submittedAt)
      VALUES (@id, @itemId, @itemTitle, @claimantName, @claimantEmail, @claimantPhone, @collegeId, @proofDetails, @status, @submittedAt)
    `);
    stmt.run(newClaim);

    res.status(201).json({ success: true, claim: newClaim });
  } catch (err) {
    console.error('[API Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. POST /api/reset - Re-seed SQLite DB with 15 initial items
app.post('/api/reset', (req, res) => {
  try {
    db.exec('DELETE FROM items; DELETE FROM claims;');
    seedDatabase();
    res.json({ success: true, message: 'SQLite database reset and re-seeded with 15 initial campus items!' });
  } catch (err) {
    console.error('[API Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 [Express + SQLite Server] Running on http://localhost:${PORT}`);
  console.log(`📁 [SQLite File] ${dbPath}`);
});
