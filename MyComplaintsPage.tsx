import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { CategoryIcon, getCategoryLabel } from '../components/CategoryIcon';
import { Search, Filter, PlusCircle, ArrowUpDown } from 'lucide-react';

export const MyComplaintsPage: React.FC = () => {
  const { complaints, currentUser, openComplaintDetails, setActiveTab } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const myComplaints = complaints.filter(
    (c) => !currentUser || c.student_id === currentUser.user_id
  );

  const filtered = myComplaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.complaint_id.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatusTab === 'all' ||
      (selectedStatusTab === 'active' &&
        (c.status === 'submitted' || c.status === 'under_review' || c.status === 'assigned')) ||
      (selectedStatusTab === 'in_progress' && c.status === 'in_progress') ||
      (selectedStatusTab === 'resolved' && c.status === 'resolved') ||
      (selectedStatusTab === 'reopened' && c.status === 'reopened');

    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Complaints Record</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full history of your logged maintenance requests, status changes, and technician resolutions
          </p>
        </div>

        <button
          onClick={() => setActiveTab('submit')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        {/* Status Tabs (Segmented control compliant with anti-slop rules) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Complaints' },
            { id: 'active', label: 'Pending / Assigned' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' },
            { id: 'reopened', label: 'Reopened' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedStatusTab === tab.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ticket ID (e.g. CMP-2026-001) or issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-blue-600 bg-slate-50"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-blue-600"
            >
              <option value="all">All Categories</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="sanitation">Sanitation</option>
              <option value="furniture">Furniture</option>
              <option value="internet">Wi-Fi & Internet</option>
              <option value="structural">Structural</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No complaints found matching the selected filters.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {filtered.map((c) => (
            <div
              key={c.complaint_id}
              onClick={() => openComplaintDetails(c.complaint_id)}
              className="p-5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {c.complaint_id}
                  </span>
                  <StatusBadge status={c.status} />
                  <PriorityBadge priority={c.priority} />
                  <span className="text-slate-300 text-xs">|</span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <CategoryIcon category={c.category} className="w-3.5 h-3.5" />
                    <span>{getCategoryLabel(c.category)}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-1">{c.description}</p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span>Room: {c.hostel_block} ({c.room_number})</span>
                  <span>Lodged: {new Date(c.created_at).toLocaleDateString()}</span>
                  {c.assigned_staff_name && (
                    <span>Assigned: <strong className="text-slate-600">{c.assigned_staff_name}</strong></span>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openComplaintDetails(c.complaint_id);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                >
                  Track Progress
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
