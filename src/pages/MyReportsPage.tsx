import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LostFoundItem } from '../types';

export const MyReportsPage: React.FC = () => {
  const {
    items,
    currentUser,
    setSelectedItemForDetail,
    setSelectedItemForEdit,
    deleteItem,
    resolveItem,
    setActiveTab,
  } = useApp();

  const [itemToDelete, setItemToDelete] = useState<LostFoundItem | null>(null);

  // If user is logged in, show their items; otherwise show items reported by student_01 or guest
  const userItems = currentUser
    ? items.filter(
        (item) =>
          item.reportedBy.id === currentUser.id ||
          item.reportedBy.email === currentUser.email
      )
    : items.filter((item) => item.reportedBy.id === 'usr_student_01' || item.reportedBy.id === 'usr_guest');

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            My Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track, update, or withdraw the lost and found reports you have filed.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('report')}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
        >
          + Report New Item
        </button>
      </div>

      {!currentUser && (
        <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-md flex items-center justify-between text-xs text-slate-700">
          <span>
            Viewing demo reports as student. Sign in to link reports to your college profile.
          </span>
          <button
            onClick={() => setActiveTab('login')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        {userItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">No reports found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't submitted any lost or found reports yet.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('report')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              >
                File Your First Report
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reported By / Contact</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {userItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                              N/A
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 line-clamp-1">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {item.category} · {item.location}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
                          item.type === 'lost'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.type === 'lost' ? 'Lost' : 'Found'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap tabular-nums text-slate-600">
                      {item.date}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                          item.status === 'resolved'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : item.status === 'claimed'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Reporter / Contact */}
                    <td className="py-3 px-4">
                      <div className="text-[11px]">
                        <div className="font-medium text-slate-800">{item.reportedBy.name}</div>
                        {item.reportedBy.department && (
                          <div className="text-slate-400">{item.reportedBy.department}</div>
                        )}
                        <a
                          href={`mailto:${item.reportedBy.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.reportedBy.email}
                        </a>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedItemForDetail(item)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setSelectedItemForEdit(item)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        {item.status !== 'resolved' && (
                          <button
                            onClick={() => resolveItem(item.id)}
                            className="px-2.5 py-1 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded text-xs font-medium transition-colors cursor-pointer"
                            title="Mark this item as returned/found"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="px-2.5 py-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-none"
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="bg-white rounded-lg border border-slate-200 shadow-lg max-w-sm w-full p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900">Delete Report</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to delete <span className="font-semibold">"{itemToDelete.title}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
