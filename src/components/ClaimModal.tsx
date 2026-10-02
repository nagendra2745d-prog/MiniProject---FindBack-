import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ClaimModal: React.FC = () => {
  const { selectedItemForClaim, setSelectedItemForClaim, submitClaim, currentUser } = useApp();

  const [claimantName, setClaimantName] = useState(currentUser?.name || '');
  const [claimantEmail, setClaimantEmail] = useState(currentUser?.email || '');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!selectedItemForClaim) return null;

  const item = selectedItemForClaim;
  const isLost = item.type === 'lost';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName.trim() || !claimantEmail.trim() || !proofDetails.trim()) {
      setErrorMsg('Please fill in your name, college email, and verification details.');
      return;
    }

    submitClaim({
      itemId: item.id,
      itemTitle: item.title,
      claimantName: claimantName.trim(),
      claimantEmail: claimantEmail.trim(),
      claimantPhone: claimantPhone.trim() || 'N/A',
      collegeId: collegeId.trim() || 'Student ID Unspecified',
      proofDetails: proofDetails.trim(),
    });

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setSelectedItemForClaim(null);
    setIsSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-none"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg border border-slate-200 shadow-lg max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isLost ? 'Contact Item Owner' : 'Submit Ownership Claim'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Regarding: <span className="font-medium text-slate-700">{item.title}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 text-lg leading-none p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <div>
              <h4 className="text-base font-semibold text-slate-900">
                Claim Submitted Successfully
              </h4>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Your claim has been forwarded to the Campus Security & Lost/Found Admin for verification. You will be notified once reviewed.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleClose}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  College ID Number
                </label>
                <input
                  type="text"
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  placeholder="e.g. CS-2024-114"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  College Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={claimantEmail}
                  onChange={(e) => setClaimantEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={claimantPhone}
                  onChange={(e) => setClaimantPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Proof of Ownership / Verification Details <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={proofDetails}
                onChange={(e) => setProofDetails(e.target.value)}
                placeholder="Describe specific identifying marks, serial numbers, case color, wallpapers, contents inside, or where and when you lost it."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                This verification helps campus staff ensure items are safely returned to genuine owners.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
              >
                Submit Claim
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
