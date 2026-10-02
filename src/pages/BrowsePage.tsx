import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ItemCard';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../data/initialData';

export const BrowsePage: React.FC = () => {
  const { items } = useApp();

  const [activeTabType, setActiveTabType] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Filter approved or resolved items for public browse
  const publicItems = items.filter(
    (item) => item.status === 'approved' || item.status === 'resolved'
  );

  const filteredItems = publicItems.filter((item) => {
    // Type tab
    if (activeTabType !== 'all' && item.type !== activeTabType) {
      return false;
    }

    // Category
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // Location
    if (selectedLocation !== 'all' && item.location !== selectedLocation) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchCat) {
        return false;
      }
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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Browse Items
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Search and filter verified lost and found belongings on campus.
        </p>
      </div>

      {/* Two Simple Tabs: Lost Items | Found Items */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTabType('all')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTabType === 'all'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Items ({publicItems.length})
        </button>
        <button
          onClick={() => setActiveTabType('lost')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTabType === 'lost'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Lost Items ({lostCount})
        </button>
        <button
          onClick={() => setActiveTabType('found')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTabType === 'found'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Found Items ({foundCount})
        </button>
      </div>

      {/* Search bar & Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name, description, location..."
              className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 bg-white"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 bg-white text-slate-700"
            >
              <option value="all">All Categories</option>
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="w-full sm:w-56">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 bg-white text-slate-700"
            >
              <option value="all">All Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters button if active */}
          {(searchQuery || selectedCategory !== 'all' || selectedLocation !== 'all' || activeTabType !== 'all') && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-3">
          <p className="text-sm font-medium text-slate-700">No matching items found.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing selected category/location filters, or report this item.
          </p>
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
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
