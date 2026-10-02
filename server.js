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
[
  {
    id: 'item-101',
    title: '65W USB-C Laptop Charger',
    type: 'lost',
    category: 'Electronics',
    description: 'Black USB-C fast charger with a slightly coiled thick braided cable. Left on a corner study desk.',
    location: 'Central Library, 2nd Floor',
    date: '2026-09-29',
    imageUrl: '/images/lost_laptop_charger_1790874005031.jpg',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_student","name":"Rahul Sharma","email":"rahul.s@kamaladevi.edu.in","department":"Computer Science"}),
    createdAt: '2026-09-29T14:30:00Z'
  },
  {
    id: 'item-102',
    title: 'Blue Metal Water Bottle',
    type: 'found',
    category: 'Other',
    description: 'Matte dark navy insulated water bottle with a small campus robotics club sticker on the base.',
    location: 'College Canteen',
    date: '2026-09-30',
    imageUrl: '/images/lost_water_bottle_1790874018368.jpg',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_priya","name":"Priya Patel","email":"priya.p@kamaladevi.edu.in","department":"Commerce"}),
    createdAt: '2026-09-30T11:15:00Z'
  },
  {
    id: 'item-103',
    title: 'Blue Lanyard with Student ID & Keys',
    type: 'found',
    category: 'Keys & Accessories',
    description: 'Royal blue campus lanyard with clear plastic badge sleeve containing student ID and two brass door keys.',
    location: 'Science Lab 3',
    date: '2026-10-01',
    imageUrl: '/images/lost_student_id_keys_1790874036797.jpg',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_vikram","name":"Vikram Singh","email":"vikram.s@kamaladevi.edu.in","department":"Physics"}),
    createdAt: '2026-10-01T08:45:00Z'
  },
  {
    id: 'item-104',
    title: 'TI-84 Plus Graphing Calculator',
    type: 'lost',
    category: 'Electronics',
    description: 'Dark grey graphing calculator with sliding hard cover. Has initials "S.V.".',
    location: 'Arts Block, Room 101',
    date: '2026-09-28',
    imageUrl: '/images/lost_graphing_calc_1790874049756.jpg',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_anjali","name":"Anjali Desai","email":"anjali.d@kamaladevi.edu.in","department":"Arts"}),
    createdAt: '2026-09-28T16:00:00Z'
  },
  {
    id: 'item-110',
    title: 'Grey Campus Varsity Hoodie',
    type: 'found',
    category: 'Clothing',
    description: 'Grey zip-up hooded sweatshirt with university logo embroidered on chest. Found on chair in auditorium.',
    location: 'Main Auditorium',
    date: '2026-09-30',
    imageUrl: '/images/campus_hoodie.png',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_student","name":"Rahul Sharma","email":"rahul.s@kamaladevi.edu.in","department":"Computer Science"}),
    createdAt: '2026-09-30T18:30:00Z'
  },
  {
    id: 'item-112',
    title: 'Amazon Kindle Paperwhite',
    type: 'found',
    category: 'Electronics',
    description: '6.8" E-reader with a black magnetic leather folding case. Found on bench outside Science Block.',
    location: 'Science Block Entrance',
    date: '2026-09-29',
    imageUrl: '/images/kindle_ereader.png',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_rohan","name":"Rohan Mehta","email":"rohan.m@kamaladevi.edu.in","department":"Commerce"}),
    createdAt: '2026-09-29T16:45:00Z'
  },
  {
    id: 'item-113',
    title: 'Car Key Fob',
    type: 'lost',
    category: 'Keys & Accessories',
    description: 'Black electronic remote key fob with key blade folded out. Has a neon orange tag attached.',
    location: 'Campus Main Gate',
    date: '2026-09-30',
    imageUrl: '/images/car_key_fob.png',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_neha","name":"Neha Gupta","email":"neha.g@kamaladevi.edu.in","department":"Arts"}),
    createdAt: '2026-09-30T09:00:00Z'
  },
  {
    id: 'item-116',
    title: 'Silver Apple Watch Series 8',
    type: 'lost',
    category: 'Electronics',
    description: 'Silver aluminum Apple Watch with a white sport band. Left in the gym locker room.',
    location: 'Sports Complex & Gym',
    date: '2026-10-02',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_arjun","name":"Arjun Reddy","email":"arjun.r@kamaladevi.edu.in","department":"Mechanical Engineering"}),
    createdAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'item-117',
    title: 'Black Leather Wallet',
    type: 'found',
    category: 'ID & Cards',
    description: 'Black bi-fold leather wallet containing college ID and some cash. Found near the library entrance.',
    location: 'Central Library',
    date: '2026-10-01',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_kavya","name":"Kavya Nair","email":"kavya.n@kamaladevi.edu.in","department":"Arts"}),
    createdAt: '2026-10-01T14:20:00Z'
  },
  {
    id: 'item-118',
    title: 'Sony Wireless Headphones',
    type: 'lost',
    category: 'Electronics',
    description: 'Black Sony WH-1000XM4 noise-canceling headphones. Lost in the computer lab.',
    location: 'Science Lab 3',
    date: '2026-10-02',
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_siddharth","name":"Siddharth Iyer","email":"siddharth.i@kamaladevi.edu.in","department":"Computer Science"}),
    createdAt: '2026-10-02T11:45:00Z'
  },
  {
    id: 'item-119',
    title: 'Green Hydro Flask Water Bottle',
    type: 'found',
    category: 'Other',
    description: 'Olive green insulated water bottle covered in stickers. Found on a bench in the campus garden.',
    location: 'Campus Main Gate',
    date: '2026-10-01',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_meera","name":"Meera Joshi","email":"meera.j@kamaladevi.edu.in","department":"Commerce"}),
    createdAt: '2026-10-01T16:30:00Z'
  },
  {
    id: 'item-120',
    title: 'Calculus Textbook 9th Edition',
    type: 'lost',
    category: 'Books & Notes',
    description: 'Heavy hardcover math textbook. Left in the study hall on the 2nd floor.',
    location: 'Arts Block, Room 101',
    date: '2026-09-30',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_karan","name":"Karan Malhotra","email":"karan.m@kamaladevi.edu.in","department":"Mathematics"}),
    createdAt: '2026-09-30T09:15:00Z'
  },
  {
    id: 'item-121',
    title: 'Ray-Ban Aviator Sunglasses',
    type: 'found',
    category: 'Keys & Accessories',
    description: 'Classic gold-framed Ray-Ban aviators. Found in the college canteen near the window seat.',
    location: 'College Canteen',
    date: '2026-10-02',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_sneha","name":"Sneha Verma","email":"sneha.v@kamaladevi.edu.in","department":"Business Administration"}),
    createdAt: '2026-10-02T13:10:00Z'
  },
  {
    id: 'item-122',
    title: 'Logitech Wireless Mouse',
    type: 'lost',
    category: 'Electronics',
    description: 'Grey ergonomic mouse with a USB dongle attached. Lost in the library reading room.',
    location: 'Central Library',
    date: '2026-10-01',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_aditya","name":"Aditya Rao","email":"aditya.r@kamaladevi.edu.in","department":"Information Technology"}),
    createdAt: '2026-10-01T15:50:00Z'
  },
  {
    id: 'item-123',
    title: 'Red Puma Backpack',
    type: 'found',
    category: 'Bags & Backpacks',
    description: 'Red and black Puma backpack containing some notebooks and stationary. Found in the main auditorium.',
    location: 'Main Auditorium',
    date: '2026-09-29',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop',
    status: 'approved',
    reportedBy: JSON.stringify({"id":"usr_pooja","name":"Pooja Iyer","email":"pooja.i@kamaladevi.edu.in","department":"Economics"}),
    createdAt: '2026-09-29T17:25:00Z'
  }
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
