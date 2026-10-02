import React, { createContext, useContext, useState, useEffect } from 'react';
import { LostFoundItem, Claim, User, ItemType } from '../types';
import { INITIAL_ITEMS, INITIAL_CLAIMS, INITIAL_USER } from '../data/initialData';

export type NavTab = 'home' | 'report' | 'my-reports' | 'login' | 'about';

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AppContextType {
  items: LostFoundItem[];
  claims: Claim[];
  currentUser: User | null;
  activeTab: NavTab;
  reportPrefillType: ItemType;
  selectedItemForDetail: LostFoundItem | null;
  selectedItemForClaim: LostFoundItem | null;
  selectedItemForEdit: LostFoundItem | null;
  
  // Navigation & modals
  setActiveTab: (tab: NavTab) => void;
  openReportWith: (type: ItemType) => void;
  setSelectedItemForDetail: (item: LostFoundItem | null) => void;
  setSelectedItemForClaim: (item: LostFoundItem | null) => void;
  setSelectedItemForEdit: (item: LostFoundItem | null) => void;
  
  // Item actions
  addItem: (itemData: Omit<LostFoundItem, 'id' | 'createdAt' | 'status' | 'reportedBy'>) => LostFoundItem;
  updateItem: (id: string, updates: Partial<LostFoundItem>) => void;
  deleteItem: (id: string) => void;
  resolveItem: (id: string) => void;

  // Claim actions
  submitClaim: (claimData: Omit<Claim, 'id' | 'status' | 'submittedAt'>) => void;

  // Auth & System
  loginWithCredentials: (username: string, pass: string) => LoginResult;
  logout: () => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_ITEMS = 'campus_lnf_student_items_v11';
const STORAGE_KEY_CLAIMS = 'campus_lnf_student_claims_v11';
const STORAGE_KEY_USER = 'campus_lnf_student_user_v11';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<LostFoundItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) {
        const parsed: LostFoundItem[] = JSON.parse(saved);
        const item113 = parsed.find((i) => i.id === 'item-113');
        if (item113 && !item113.imageUrl.includes('unsplash')) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_ITEMS;
  });

  const [claims, setClaims] = useState<Claim[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLAIMS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CLAIMS;
  });

  // Always start logged-out so the landing page shows first on every visit
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState<NavTab>('about');
  const [reportPrefillType, setReportPrefillType] = useState<ItemType>('lost');
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<LostFoundItem | null>(null);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<LostFoundItem | null>(null);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<LostFoundItem | null>(null);

  // Fetch initial data from SQLite REST API
  useEffect(() => {
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch((err) => console.log('[SQLite Fetch Status]', err));

    fetch('/api/claims')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.claims)) {
          setClaims(data.claims);
        }
      })
      .catch(() => {});
  }, []);

  // Sync to local storage as client backup
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  const openReportWith = (type: ItemType) => {
    setReportPrefillType(type);
    setActiveTab('report');
  };

  const addItem = (itemData: Omit<LostFoundItem, 'id' | 'createdAt' | 'status' | 'reportedBy'>): LostFoundItem => {
    const newItem: LostFoundItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      status: 'active',
      reportedBy: {
        id: currentUser ? currentUser.id : `usr_${Date.now()}`,
        name: currentUser ? currentUser.name : 'College Student',
        email: currentUser ? currentUser.email : 'student@kamaladevi.edu.in',
        department: currentUser ? currentUser.department : 'General Campus',
      },
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);

    fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    }).catch((e) => console.error('[SQLite Sync Error]', e));

    return newItem;
  };

  const updateItem = (id: string, updates: Partial<LostFoundItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    if (selectedItemForDetail && selectedItemForDetail.id === id) {
      setSelectedItemForDetail((prev) => (prev ? { ...prev, ...updates } : null));
    }

    fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch((e) => console.error('[SQLite Sync Error]', e));
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setClaims((prev) => prev.filter((c) => c.itemId !== id));
    if (selectedItemForDetail && selectedItemForDetail.id === id) {
      setSelectedItemForDetail(null);
    }

    fetch(`/api/items/${id}`, { method: 'DELETE' }).catch((e) => console.error('[SQLite Sync Error]', e));
  };

  const resolveItem = (id: string) => {
    updateItem(id, { status: 'resolved' });
  };

  const submitClaim = (claimData: Omit<Claim, 'id' | 'status' | 'submittedAt'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: `claim-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setClaims((prev) => [newClaim, ...prev]);

    fetch('/api/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClaim),
    }).catch((e) => console.error('[SQLite Sync Error]', e));
  };

  const loginWithCredentials = (username: string, pass: string): LoginResult => {
    const cleanUser = username.trim();
    if (!cleanUser) {
      return { success: false, error: 'Please enter your student username or ID.' };
    }
    if (!pass.trim()) {
      return { success: false, error: 'Please enter your password.' };
    }

    const studentUser: User = {
      id: `usr_${cleanUser.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      name: cleanUser === 'student' ? 'Rahul Sharma' : cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
      email: `${cleanUser.toLowerCase().replace(/[^a-z0-9]/g, '')}@kamaladevi.edu.in`,
      department: 'Computer Science',
    };

    setCurrentUser(studentUser);
    setActiveTab('home');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('about');
  };

  const resetToDefaults = () => {
    setItems(INITIAL_ITEMS);
    setClaims(INITIAL_CLAIMS);
    setCurrentUser(INITIAL_USER);
    setActiveTab('home');
    localStorage.removeItem(STORAGE_KEY_ITEMS);
    localStorage.removeItem(STORAGE_KEY_CLAIMS);
    localStorage.removeItem(STORAGE_KEY_USER);

    fetch('/api/reset', { method: 'POST' })
      .then((r) => r.json())
      .then(() => fetch('/api/items').then((r) => r.json()).then((d) => d.items && setItems(d.items)))
      .catch(() => {});
  };

  return (
    <AppContext.Provider
      value={{
        items,
        claims,
        currentUser,
        activeTab,
        reportPrefillType,
        selectedItemForDetail,
        selectedItemForClaim,
        selectedItemForEdit,
        setActiveTab,
        openReportWith,
        setSelectedItemForDetail,
        setSelectedItemForClaim,
        setSelectedItemForEdit,
        addItem,
        updateItem,
        deleteItem,
        resolveItem,
        submitClaim,
        loginWithCredentials,
        logout,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
