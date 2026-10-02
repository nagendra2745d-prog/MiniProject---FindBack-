import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ItemCard';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../data/initialData';

export const HomePage: React.FC = () => {
  const { items, openReportWith } = useApp();

  const [activeTabType, setActiveTabType] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const publicItems = items.filter(
    (item) => item.status === 'active' || item.status === 'approved' || item.status === 'resolved'
  );

  const filteredItems = publicItems.filter((item) => {
    if (activeTabType !== 'all' && item.type !== activeTabType) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedLocation !== 'all' && item.location !== selectedLocation) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !item.title.toLowerCase().includes(q) &&
        !item.description.toLowerCase().includes(q) &&
        !item.location.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const lostCount = publicItems.filter((i) => i.type === 'lost').length;
  const foundCount = publicItems.filter((i) => i.type === 'found').length;

  const resetFilters = () => {
    setActiveTabType('all');
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
  };

  const hasFilters = searchQuery || selectedCategory !== 'all' || selectedLocation !== 'all' || activeTabType !== 'all';

  return (
    <div className="space-y-6">

      {/* ─── Top action bar ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">FindBack</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {publicItems.length} listings &nbsp;·&nbsp; {lostCount} lost &nbsp;·&nbsp; {foundCount} found
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openReportWith('found')}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-stone-300 hover:border-stone-400 rounded-md transition-colors cursor-pointer"
          >
            I Found Something
          </button>
          <button
            onClick={() => openReportWith('lost')}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            Report Lost Item
          </button>
        </div>
      </div>

      {/* ─── Filters row ────────────────────────────────── */}
      <div className="bg-white border border-stone-200 rounded-lg p-3 flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, locations, categories…"
            className="w-full text-sm pl-9 pr-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 bg-white"
          />
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-sm px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-slate-900 bg-white text-slate-700 sm:w-40"
        >
          <option value="all">All Categories</option>
          {ITEM_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Location */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="text-sm px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-slate-900 bg-white text-slate-700 sm:w-48"
        >
          <option value="all">All Locations</option>
          {CAMPUS_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-slate-500 hover:text-slate-800 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* ─── Type tabs ──────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-stone-200">
        {([
          { id: 'all', label: `All (${publicItems.length})` },
          { id: 'lost', label: `Lost (${lostCount})` },
          { id: 'found', label: `Found (${foundCount})` },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabType(tab.id)}
            className={`pb-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTabType === tab.id
                ? 'text-slate-900 border-slate-900'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Items grid ─────────────────────────────────── */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-lg py-16 text-center">
          <p className="text-slate-500 text-sm mb-1">No items match your search.</p>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="mt-3 text-xs text-slate-900 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
