import React, { useState } from 'react';
import { LostFoundItem } from '../types';
import { useApp } from '../context/AppContext';

interface ItemCardProps {
  item: LostFoundItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { setSelectedItemForDetail } = useApp();
  const [imageError, setImageError] = useState(false);

  const isLost = item.type === 'lost';

  return (
    <article
      onClick={() => setSelectedItemForDetail(item)}
      className="bg-white border border-stone-200 rounded-lg overflow-hidden flex flex-col hover:border-stone-300 hover:shadow-md transition-all duration-150 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {item.imageUrl && !imageError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">{item.category}</span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              isLost
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-green-50 text-green-700 border border-green-100'
            }`}
          >
            {isLost ? 'Lost' : 'Found'}
          </span>
        </div>

        {/* Resolved badge */}
        {item.status === 'resolved' && (
          <div className="absolute top-2 right-2">
            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-white">
              Resolved
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5 flex-1 flex flex-col gap-2">
        <div>
          <p className="text-[11px] text-slate-400 mb-0.5">{item.category}</p>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{item.title}</h3>
        </div>

        <div className="space-y-0.5 text-xs text-slate-500">
          <div className="flex items-start gap-1 truncate">
            <span className="shrink-0 mt-0.5">📍</span>
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>{item.date}</span>
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-900 font-medium group-hover:underline">
            View details →
          </span>
        </div>
      </div>
    </article>
  );
};
