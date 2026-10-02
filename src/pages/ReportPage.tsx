import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../data/initialData';
import { ItemCategory, ItemType, LostFoundItem } from '../types';

import chargerImg from '../assets/images/lost_laptop_charger_1790874005031.jpg';
import waterBottleImg from '../assets/images/lost_water_bottle_1790874018368.jpg';
import keysImg from '../assets/images/lost_student_id_keys_1790874036797.jpg';
import calcImg from '../assets/images/lost_graphing_calc_1790874049756.jpg';

export const ReportPage: React.FC = () => {
  const { addItem, reportPrefillType, setActiveTab, currentUser } = useApp();

  const [type, setType] = useState<ItemType>(reportPrefillType || 'lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [submittedItem, setSubmittedItem] = useState<LostFoundItem | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newItem = addItem({
      title: title.trim(),
      type,
      category,
      description: description.trim(),
      location: location.trim(),
      date,
      imageUrl: imageUrl || '',
    });

    setSubmittedItem(newItem);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setSubmittedItem(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Report Item
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Provide accurate details to help campus security and fellow students return items quickly.
        </p>
      </div>

      {submittedItem ? (
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-5 text-center">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Report Published Successfully
            </h2>
            <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Your report for <span className="font-semibold text-slate-800">"{submittedItem.title}"</span> is now live on the Lost & Found board.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Fellow students can now view your listing and get in touch with you.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              View on Lost & Found Board
            </button>
            <button
              onClick={() => setActiveTab('my-reports')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              View in My Reports
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
            >
              + Report Another Item
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-5">
          {!currentUser && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center justify-between text-xs text-amber-900">
              <span>You are currently reporting as Guest. Sign in to link this report to your student account.</span>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="font-semibold underline ml-2 cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Lost or Found Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Lost or Found <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-2.5 border rounded-md cursor-pointer transition-colors text-xs font-medium ${
                  type === 'lost'
                    ? 'border-rose-600 bg-rose-50/50 text-rose-900 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="itemType"
                  value="lost"
                  checked={type === 'lost'}
                  onChange={() => setType('lost')}
                  className="accent-rose-600"
                />
                <span>Lost Item</span>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-2.5 border rounded-md cursor-pointer transition-colors text-xs font-medium ${
                  type === 'found'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="itemType"
                  value="found"
                  checked={type === 'found'}
                  onChange={() => setType('found')}
                  className="accent-emerald-600"
                />
                <span>Found Item</span>
              </label>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dell XPS USB-C Charger, Hydro Flask, Student ID Card"
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 bg-white"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 bg-white text-slate-700"
              >
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 bg-white text-slate-700"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              list="locations-datalist"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Central Library 2nd Floor, Room 302, Cafeteria"
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 bg-white text-slate-700"
            />
            <datalist id="locations-datalist">
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide color, brand, distinct scratches, contents, or circumstances where it was left or found..."
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 bg-white leading-relaxed"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upload Image
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              />

              {/* Sample Presets for easy testing if no photo at hand */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-500 block mb-1.5">
                  Or select a demo campus item photo:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(chargerImg)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                  >
                    Laptop Charger
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(waterBottleImg)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                  >
                    Water Bottle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(keysImg)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                  >
                    Lanyard & Keys
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(calcImg)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                  >
                    Calculator
                  </button>
                </div>
              </div>

              {/* Preview */}
              {imageUrl && (
                <div className="mt-2 relative w-32 aspect-[4/3] rounded-md overflow-hidden border border-slate-200">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-pointer"
                    title="Remove Image"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              Submit Report
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
