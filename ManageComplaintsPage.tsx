import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { CategoryIcon, getCategoryLabel } from '../components/CategoryIcon';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  UserCheck,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

export const ManageComplaintsPage: React.FC = () => {
  const { complaints, users, openComplaintDetails, assignComplaint } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [blockFilter, setBlockFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');

  const staffUsers = users.filter((u) => u.role === 'staff');

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.complaint_id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.student_name.toLowerCase().includes(search.toLowerCase()) ||
      c.room_number.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
    const matchesBlock = blockFilter === 'all' || c.hostel_block.includes(blockFilter);
    const matchesStaff =
      staffFilter === 'all' ||
      (staffFilter === 'unassigned' && !c.assigned_staff_id) ||
      c.assigned_staff_id === staffFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesBlock && matchesStaff;
  });

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setBlockFilter('all');
    setStaffFilter('all');
  };

  const exportCSV = () => {
    const headers = [
      'Complaint ID',
      'Student Name',
      'Block',
      'Room',
      'Title',
      'Category',
      'Priority',
      'Status',
      'Assigned Staff',
      'Logged At',
      'Resolved At',
    ];

    const rows = filtered.map((c) => [
      c.complaint_id,
      `"${c.student_name}"`,
      `"${c.hostel_block}"`,
      c.room_number,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.priority,
      c.status,
      `"${c.assigned_staff_name || 'Unassigned'}"`,
      c.created_at,
      c.resolved_at || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hostel_complaints_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Hostel Complaints</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter, search, assign staff, and audit maintenance records across all residential blocks
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-colors border border-slate-200 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Filtered CSV ({filtered.length})</span>
        </button>
      </div>

      {/* Filter Control Surface */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ticket ID, room number, student name, or fault keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-blue-600"
          />
        </div>

        {/* Multi-Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs py-1.5 px-2 rounded-lg border border-slate-200 bg-white text-slate-700"
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

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs py-1.5 px-2 rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="reopened">Reopened</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full text-xs py-1.5 px-2 rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Hostel Block</label>
            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              className="w-full text-xs py-1.5 px-2 rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="all">All Blocks</option>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
              <option value="Block D">Block D</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Assigned Staff</label>
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="w-full text-xs py-1.5 px-2 rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="all">All Staff</option>
              <option value="unassigned">Unassigned Only</option>
              {staffUsers.map((s) => (
                <option key={s.user_id} value={s.user_id}>
                  {s.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Helper */}
        {(search || categoryFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || blockFilter !== 'all' || staffFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Showing <strong className="text-slate-800">{filtered.length}</strong> of {complaints.length} complaints
            </span>
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Complaint Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Lodged</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No complaints matching current filter settings.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.complaint_id}
                    onClick={() => openComplaintDetails(c.complaint_id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {c.complaint_id}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{c.room_number}</div>
                      <div className="text-[10px] text-slate-400">{c.hostel_block.split(' ')[0]} {c.hostel_block.split(' ')[1]}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{c.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        By {c.student_name}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <CategoryIcon category={c.category} className="w-3.5 h-3.5" />
                        <span className="capitalize">{c.category}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {c.assigned_staff_name ? (
                        <div className="text-slate-800 font-medium flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{c.assigned_staff_name.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openComplaintDetails(c.complaint_id)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
