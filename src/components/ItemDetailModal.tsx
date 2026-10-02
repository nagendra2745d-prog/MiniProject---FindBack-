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
    updateItem,
    claims,
  } = useApp();

  const [imageError, setImageError] = useState(false);
  const [showFoundForm, setShowFoundForm] = useState(false);

  const [finderName, setFinderName] = useState(currentUser?.name || '');
  const [finderEmail, setFinderEmail] = useState(currentUser?.email || '');
  const [finderPhone, setFinderPhone] = useState('');
  const [finderNote, setFinderNote] = useState('');

  if (!selectedItemForDetail) return null;

  const item = selectedItemForDetail;
  const isLost = item.type === 'lost';
  const isOwner = currentUser?.id === item.reportedBy.id;
  const matchingClaim = claims?.find((c) => c.itemId === item.id);

  const handleOpenClaim = () => {
    setSelectedItemForClaim(item);
    setSelectedItemForDetail(null);
  };

  const handleEdit = () => {
    setSelectedItemForEdit(item);
    setSelectedItemForDetail(null);
  };

  const handleFoundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finderName.trim() || !finderEmail.trim()) return;

    const newFinderInfo = {
      name: finderName.trim(),
      email: finderEmail.trim(),
      phone: finderPhone.trim() || undefined,
      note: finderNote.trim() || undefined,
      foundAt: new Date().toISOString(),
    };

    updateItem(item.id, { finderInfo: newFinderInfo });
    setShowFoundForm(false);
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
                    : item.finderInfo
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {item.finderInfo && item.status !== 'resolved'
                  ? 'FOUND (MATCH AVAILABLE)'
                  : `STATUS: ${item.status.toUpperCase()}`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Category: <span className="text-slate-700 font-medium">{item.category}</span>
            </p>
          </div>

          {/* Finder Info Box (if someone reported finding this lost item) */}
          {isLost && item.finderInfo && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="text-base">🎉</span> Someone Found This Item!
                </h4>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded">
                  Finder Details Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                <div>
                  <span className="text-slate-500 block mb-0.5">Found By</span>
                  <span className="font-semibold text-slate-900">{item.finderInfo.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Contact Email</span>
                  <a href={`mailto:${item.finderInfo.email}`} className="font-semibold text-blue-600 hover:underline">
                    {item.finderInfo.email}
                  </a>
                </div>
                {item.finderInfo.phone && (
                  <div>
                    <span className="text-slate-500 block mb-0.5">Phone Number</span>
                    <a href={`tel:${item.finderInfo.phone}`} className="font-semibold text-blue-600 hover:underline">
                      {item.finderInfo.phone}
                    </a>
                  </div>
                )}
                {item.finderInfo.foundAt && (
                  <div>
                    <span className="text-slate-500 block mb-0.5">Reported Found On</span>
                    <span className="text-slate-800 font-medium">
                      {new Date(item.finderInfo.foundAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {item.finderInfo.note && (
                <div className="bg-white p-2.5 rounded border border-emerald-200 text-xs">
                  <span className="text-slate-500 block text-[11px] font-medium mb-0.5">📍 Location & Note from Finder:</span>
                  <p className="text-slate-900 font-medium">{item.finderInfo.note}</p>
                </div>
              )}

              <div className="pt-2 border-t border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-[11px] text-emerald-800">
                  💡 <strong>Next Steps:</strong> Contact the finder to verify details. Once verified and retrieved, click <strong>Mark as Found & Resolved</strong>.
                </p>
                {item.status !== 'resolved' && (
                  <button
                    onClick={() => resolveItem(item.id)}
                    className="w-full sm:w-auto shrink-0 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-xs cursor-pointer"
                  >
                    ✅ Mark as Found & Resolved
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Interactive Finder Form for Lost Items */}
          {isLost && !item.finderInfo && item.status !== 'resolved' && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5">
              {!showFoundForm ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-semibold text-blue-950">Did you find this item?</h4>
                    <p className="text-[11px] text-slate-600">Submit your contact info so the owner can reach you and verify.</p>
                  </div>
                  <button
                    onClick={() => setShowFoundForm(true)}
                    className="shrink-0 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
                  >
                    ✋ I Found This Item!
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFoundSubmit} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                    <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1">
                      <span>✋</span> Submit Finder Contact Details
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowFoundForm(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={finderName}
                        onChange={(e) => setFinderName(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                        placeholder="e.g. Amit Kumar"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Your Email *</label>
                      <input
                        type="email"
                        required
                        value={finderEmail}
                        onChange={(e) => setFinderEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                        placeholder="e.g. amit.k@college.edu"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={finderPhone}
                        onChange={(e) => setFinderPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Where is it kept / Note</label>
                      <input
                        type="text"
                        value={finderNote}
                        onChange={(e) => setFinderNote(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                        placeholder="e.g. Left at Central Library helpdesk"
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors cursor-pointer"
                    >
                      Submit Found Details
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

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
          </div>

          {/* Item Lifecycle Summary & Claim Status Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="flex items-center gap-1.5">
                <span>📋</span> Item Handover & Lifecycle Summary
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                item.status === 'resolved'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                  : matchingClaim
                  ? 'bg-purple-100 text-purple-800 border border-purple-300 font-semibold'
                  : item.finderInfo
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {item.status === 'resolved'
                  ? '✅ CLAIM CONFIRMED & RESOLVED'
                  : matchingClaim
                  ? '⏳ CLAIM SUBMITTED (IN REVIEW)'
                  : item.finderInfo
                  ? '🎉 FOUND MATCH AVAILABLE'
                  : 'ACTIVE REPORT'}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Lost By Details */}
              <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">
                  🙋 Lost By (Owner)
                </span>
                {isLost ? (
                  <>
                    <p className="font-semibold text-slate-900">{item.reportedBy.name}</p>
                    <a href={`mailto:${item.reportedBy.email}`} className="text-blue-600 hover:underline text-[11px] block">
                      {item.reportedBy.email}
                    </a>
                    <p className="text-[11px] text-slate-500 pt-0.5">
                      Lost On: <strong className="text-slate-700">{item.date}</strong>
                    </p>
                  </>
                ) : matchingClaim ? (
                  <>
                    <p className="font-semibold text-slate-900">{matchingClaim.claimantName}</p>
                    <a href={`mailto:${matchingClaim.claimantEmail}`} className="text-blue-600 hover:underline text-[11px] block">
                      {matchingClaim.claimantEmail}
                    </a>
                    <p className="text-[11px] text-slate-500 pt-0.5">
                      Claimed On: <strong className="text-slate-700">{new Date(matchingClaim.submittedAt).toLocaleDateString()}</strong>
                    </p>
                  </>
                ) : (
                  <p className="text-slate-400 italic text-[11px]">Awaiting owner claim</p>
                )}
              </div>

              {/* Found By Details */}
              <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase">
                  🔍 Found By (Finder)
                </span>
                {!isLost ? (
                  <>
                    <p className="font-semibold text-slate-900">{item.reportedBy.name}</p>
                    <a href={`mailto:${item.reportedBy.email}`} className="text-blue-600 hover:underline text-[11px] block">
                      {item.reportedBy.email}
                    </a>
                    <p className="text-[11px] text-slate-500 pt-0.5">
                      Found On: <strong className="text-slate-700">{item.date}</strong>
                    </p>
                  </>
                ) : item.finderInfo ? (
                  <>
                    <p className="font-semibold text-slate-900">{item.finderInfo.name}</p>
                    <a href={`mailto:${item.finderInfo.email}`} className="text-blue-600 hover:underline text-[11px] block">
                      {item.finderInfo.email}
                    </a>
                    <p className="text-[11px] text-slate-500 pt-0.5">
                      Found On: <strong className="text-slate-700">
                        {item.finderInfo.foundAt ? new Date(item.finderInfo.foundAt).toLocaleDateString() : item.date}
                      </strong>
                    </p>
                  </>
                ) : (
                  <p className="text-slate-400 italic text-[11px]">Awaiting finder details</p>
                )}
              </div>
            </div>

            {/* Verification Status Summary Line */}
            <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
              <span className="text-slate-600 font-medium">
                Claim Confirmation Status:
              </span>
              <span className="font-bold text-slate-900">
                {item.status === 'resolved'
                  ? '✅ CLAIM CONFIRMED & HANDOVER COMPLETED'
                  : matchingClaim
                  ? `⏳ Claim submitted by ${matchingClaim.claimantName} (Pending Admin/Owner Verification)`
                  : item.finderInfo
                  ? `🎉 Found by ${item.finderInfo.name} — Pending Owner Verification & Collection`
                  : '🔍 Active Lost/Found Listing — Open for claims'}
              </span>
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

            {item.status !== 'resolved' && !isOwner && !item.finderInfo && (
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

