const fs = require('fs');

const items = [
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
    reportedBy: {
      id: 'usr_student',
      name: 'Rahul Sharma',
      email: 'rahul.s@kamaladevi.edu.in',
      department: 'Computer Science',
    },
    createdAt: '2026-09-29T14:30:00Z',
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
    reportedBy: {
      id: 'usr_priya',
      name: 'Priya Patel',
      email: 'priya.p@kamaladevi.edu.in',
      department: 'Commerce',
    },
    createdAt: '2026-09-30T11:15:00Z',
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
    reportedBy: {
      id: 'usr_vikram',
      name: 'Vikram Singh',
      email: 'vikram.s@kamaladevi.edu.in',
      department: 'Physics',
    },
    createdAt: '2026-10-01T08:45:00Z',
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
    reportedBy: {
      id: 'usr_anjali',
      name: 'Anjali Desai',
      email: 'anjali.d@kamaladevi.edu.in',
      department: 'Arts',
    },
    createdAt: '2026-09-28T16:00:00Z',
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
    reportedBy: {
      id: 'usr_student',
      name: 'Rahul Sharma',
      email: 'rahul.s@kamaladevi.edu.in',
      department: 'Computer Science',
    },
    createdAt: '2026-09-30T18:30:00Z',
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
    reportedBy: {
      id: 'usr_rohan',
      name: 'Rohan Mehta',
      email: 'rohan.m@kamaladevi.edu.in',
      department: 'Commerce',
    },
    createdAt: '2026-09-29T16:45:00Z',
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
    reportedBy: {
      id: 'usr_neha',
      name: 'Neha Gupta',
      email: 'neha.g@kamaladevi.edu.in',
      department: 'Arts',
    },
    createdAt: '2026-09-30T09:00:00Z',
  }
];

const locations = [
  'Central Library',
  'College Canteen',
  'Science Lab 3',
  'Arts Block, Room 101',
  'Main Auditorium',
  'Science Block Entrance',
  'Campus Main Gate',
  'Commerce Wing'
];

// Update server.js
let serverJs = fs.readFileSync('server.js', 'utf8');
const serverItemsRegex = /const INITIAL_ITEMS = \[([\s\S]*?)\];/;

const serverItemsString = `const INITIAL_ITEMS = [\n` + items.map(i => {
  return `  {
    id: '${i.id}',
    title: '${i.title}',
    type: '${i.type}',
    category: '${i.category}',
    description: '${i.description}',
    location: '${i.location}',
    date: '${i.date}',
    imageUrl: '${i.imageUrl}',
    status: '${i.status}',
    reportedBy: JSON.stringify(${JSON.stringify(i.reportedBy)}),
    createdAt: '${i.createdAt}'
  }`;
}).join(',\n') + `\n];`;

serverJs = serverJs.replace(serverItemsRegex, serverItemsString);
fs.writeFileSync('server.js', serverJs);

// Update initialData.ts
let initialDataTs = fs.readFileSync('src/data/initialData.ts', 'utf8');
const initialItemsRegex = /export const INITIAL_ITEMS: LostFoundItem\[\] = \[([\s\S]*?)\];/;

const initialItemsString = `export const INITIAL_ITEMS: LostFoundItem[] = [\n` + items.map(i => {
  return `  {
    id: '${i.id}',
    title: '${i.title}',
    type: '${i.type}',
    category: '${i.category}',
    description: '${i.description}',
    location: '${i.location}',
    date: '${i.date}',
    imageUrl: '${i.imageUrl}',
    status: '${i.status}',
    reportedBy: ${JSON.stringify(i.reportedBy, null, 4).split('\n').join('\n    ')},
    createdAt: '${i.createdAt}'
  }`;
}).join(',\n') + `\n];`;

initialDataTs = initialDataTs.replace(initialItemsRegex, initialItemsString);

const locationsRegex = /export const CAMPUS_LOCATIONS = \[([\s\S]*?)\];/;
const locationsString = `export const CAMPUS_LOCATIONS = [\n  '` + locations.join(`',\n  '`) + `'\n];`;
initialDataTs = initialDataTs.replace(locationsRegex, locationsString);

const userRegex = /export const INITIAL_USER: User = {[\s\S]*?};/;
const userString = `export const INITIAL_USER: User = {
  id: 'usr_student',
  name: 'Rahul Sharma',
  email: 'rahul.s@kamaladevi.edu.in',
  department: 'Computer Science',
};`;
initialDataTs = initialDataTs.replace(userRegex, userString);

fs.writeFileSync('src/data/initialData.ts', initialDataTs);

// Update AppContext.tsx
let appContextTs = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
appContextTs = appContextTs.replace(/Alex Johnson/g, 'Rahul Sharma');
appContextTs = appContextTs.replace(/college\.edu/g, 'kamaladevi.edu.in');
appContextTs = appContextTs.replace(/College Campus/g, 'Computer Science');
fs.writeFileSync('src/context/AppContext.tsx', appContextTs);

console.log("Files updated successfully!");
