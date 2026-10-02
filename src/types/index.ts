export type ItemType = 'lost' | 'found';

export type ItemStatus = 'active' | 'resolved' | 'claimed' | 'approved' | 'pending';

export type ItemCategory =
  | 'Electronics'
  | 'ID & Cards'
  | 'Keys & Accessories'
  | 'Books & Notes'
  | 'Bags & Backpacks'
  | 'Clothing'
  | 'Other';

export interface FinderInfo {
  name: string;
  email: string;
  phone?: string;
  note?: string;
  foundAt?: string;
}

export interface LostFoundItem {
  id: string;
  title: string;
  type: ItemType;
  category: ItemCategory;
  description: string;
  location: string;
  date: string;
  imageUrl: string;
  status: ItemStatus;
  reportedBy: {
    id: string;
    name: string;
    email: string;
    department?: string;
  };
  finderInfo?: FinderInfo | null;
  createdAt: string;
}

export interface Claim {
  id: string;
  itemId: string;
  itemTitle: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  collegeId: string;
  proofDetails: string;
  status: 'pending' | 'resolved';
  submittedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
}
