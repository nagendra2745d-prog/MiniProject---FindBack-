import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ItemDetailModal: React.FC = () => {
  const {
    selectedItemForDetail,
    setSelectedItemForDetail,
    setSelectedItemForClaim,
    setSelectedItemForEdit,
    currentUser,
    resolveItem,
  } = useApp();

  const [imageError, setImageError] = useState(false);

  if (!selectedItemForDetail) return null;

  const item = selectedItemForDetail;
  const isLost = item.type === 'lost';
  const isOwner = currentUser?.id === item.reportedBy.id;

  const handleOpenClaim = () => {
    setSelectedItemForClaim(item);
    setSelectedItemForDetail(null);
  };

  const handleEdit = () => {
    setSelectedItemForEdit(item);
    setSelectedItemForDetail(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-none"
      onClick={() => setSelectedItemForDetail(null)}
    >
      <div
        className="bg-white rounded-lg border border-slate-200 shadow-lg max-w-xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isLost
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isLost ? 'Lost Item' : 'Found Item'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ID: {item.id}
            </span>
          </div>
          <button
            onClick={() => setSelectedItemForDetail(null)}
            className="text-slate-400 hover:text-slate-700 text-lg leading-none p-1 cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Large image */}
          <div className="relative aspect-[16/10] bg-slate-100 rounded-md overflow-hidden border border-slate-200">
            {item.imageUrl && !imageError ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <span className="text-sm font-medium">{item.category}</span>
                <span className="text-xs mt-1">No image provided</span>
              </div>
            )}
          </div>

          {/* Title and Status */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {item.title}
              </h2>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded shrink-0 ${
                  item.status === 'resolved'
                    ? 'bg-slate-100 text-slate-700 border border-slate-300'
                    : item.status === 'claimed'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                Status: {item.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Category: <span className="text-slate-700 font-medium">{item.category}</span>
            </p>
          </div>

          {/* Description */}
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs border border-slate-200 rounded-md p-3.5">
            <div>
              <span className="text-slate-400 block mb-0.5">Location</span>
              <span className="font-medium text-slate-800">{item.location}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Date Reported</span>
              <span className="font-medium text-slate-800 tabular-nums">{item.date}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-100">
              <span className="text-slate-400 block mb-0.5">
                {isLost ? '🙋 Lost By (Owner)' : '🔍 Found By'}
              </span>
              <span className="font-medium text-slate-800">{item.reportedBy.name}</span>
              {item.reportedBy.department && (
                <span className="text-slate-500 ml-1">({item.reportedBy.department})</span>
              )}
              <a href={`mailto:${item.reportedBy.email}`} className="text-blue-600 hover:underline block mt-0.5">
                {item.reportedBy.email}
              </a>
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            {isOwner && (
              <>
                <button
                  onClick={handleEdit}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  Edit Report
                </button>
                {item.status !== 'resolved' && (
                  <button
                    onClick={() => resolveItem(item.id)}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
                  >
                    Mark as Resolved
                  </button>
                )}
              </>
            )}

            {item.status !== 'resolved' && !isOwner && (
              <button
                onClick={handleOpenClaim}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
              >
                {isLost ? 'Found this? Contact Owner' : 'Contact / Submit Claim'}
              </button>
            )}

            {item.status === 'resolved' && (
              <span className="text-xs text-slate-500 font-medium">
                This item has been marked as resolved.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
