import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { CategoryIcon, getCategoryLabel } from '../components/CategoryIcon';
import {
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { CATEGORIES } from '../data/seedData';

export const WardenDashboard: React.FC = () => {
  const {
    complaints,
    users,
    openComplaintDetails,
    setActiveTab,
    assignComplaint,
    exportDatabaseJSON,
  } = useApp();

  const [quickAssignModal, setQuickAssignModal] = useState<{
    complaintId: string;
    complaintTitle: string;
  } | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [assignNotes, setAssignNotes] = useState('');

  // Metrics
  const total = complaints.length;
  const pendingTriage = complaints.filter(
    (c) => c.status === 'submitted' || c.status === 'under_review'
  ).length;
  const inProgress = complaints.filter(
    (c) => c.status === 'assigned' || c.status === 'in_progress'
  ).length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;
  const reopened = complaints.filter((c) => c.status === 'reopened').length;
  const criticalCount = complaints.filter(
    (c) => (c.priority === 'critical' || c.priority === 'high') && c.status !== 'resolved'
  ).length;

  // Technicians
  const staffMembers = users.filter((u) => u.role === 'staff');

  // Urgent tickets requiring warden attention
  const urgentQueue = complaints
    .filter(
      (c) =>
        c.status !== 'resolved' &&
        (c.priority === 'critical' || c.priority === 'high' || c.status === 'reopened' || !c.assigned_staff_id)
    )
    .slice(0, 6);

  // Category counts
  const categoryCounts = CATEGORIES.map((cat) => {
    const count = complaints.filter((c) => c.category === cat.id).length;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return { ...cat, count, pct };
  });

  // Block breakdown
  const blocks = ['Block A', 'Block B', 'Block C', 'Block D'];
  const blockStats = blocks.map((bName) => {
    const blockComplaints = complaints.filter((c) => c.hostel_block.includes(bName));
    const blockPending = blockComplaints.filter((c) => c.status !== 'resolved').length;
    return { name: bName, total: blockComplaints.length, pending: blockPending };
  });

  const handleQuickAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAssignModal || !selectedStaffId) return;
    assignComplaint(quickAssignModal.complaintId, selectedStaffId, assignNotes);
    setQuickAssignModal(null);
    setSelectedStaffId('');
    setAssignNotes('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hostel Administration & Warden Console</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time facility oversight, emergency triage, staff assignment, and maintenance SLA monitoring
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-colors border border-slate-200 shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Generate Report</span>
          </button>

          <button
            onClick={() => setActiveTab('manage-complaints')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
          >
            <span>Full Complaints Roster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards (PRD FR-8) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Tickets
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {total}
          </div>
          <div className="text-[11px] text-slate-500">Cumulative logged</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
            Pending Triage
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
            {pendingTriage}
          </div>
          <div className="text-[11px] text-slate-500">Needs staff dispatch</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
            In Progress
          </div>
          <div className="text-2xl font-bold text-indigo-700 font-mono tabular-nums">
            {inProgress}
          </div>
          <div className="text-[11px] text-slate-500">Active repairs on site</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
            Resolved
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            {resolved}
          </div>
          <div className="text-[11px] text-slate-500">Verified & closed</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
            Critical Alerts
          </div>
          <div className="text-2xl font-bold text-rose-700 font-mono tabular-nums">
            {criticalCount}
          </div>
          <div className="text-[11px] text-rose-600 font-medium">Urgent attention</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
            Avg Resolution
          </div>
          <div className="text-2xl font-bold text-blue-700 font-mono tabular-nums">
            4.2 hrs
          </div>
          <div className="text-[11px] text-slate-500">Target SLA &lt; 24h</div>
        </div>
      </div>

      {/* Main Grid: Urgent Triage Queue + Facility Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Triage Queue (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Urgent & High-Priority Triage Queue</span>
              </h2>
              <p className="text-xs text-slate-500">Complaints requiring immediate technician assignment or re-inspection</p>
            </div>
            <button
              onClick={() => setActiveTab('manage-complaints')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {urgentQueue.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                All high-priority complaints have been assigned and resolved!
              </div>
            ) : (
              urgentQueue.map((c) => (
                <div
                  key={c.complaint_id}
                  onClick={() => openComplaintDetails(c.complaint_id)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {c.complaint_id}
                      </span>
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-medium text-slate-700">
                        {c.hostel_block} ({c.room_number})
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {c.title}
                    </h3>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Reported by: {c.student_name}</span>
                      <span>·</span>
                      {c.assigned_staff_name ? (
                        <span className="text-slate-600 font-medium">
                          Assigned: {c.assigned_staff_name}
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold">Unassigned</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!c.assigned_staff_id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickAssignModal({
                            complaintId: c.complaint_id,
                            complaintTitle: c.title,
                          });
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                      >
                        Assign Staff
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openComplaintDetails(c.complaint_id);
                      }}
                      className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Analytics: Category & Block Distribution */}
        <div className="space-y-6">
          {/* Categories Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Complaints by Category</h3>
            <div className="space-y-3">
              {categoryCounts.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 font-medium">{cat.label}</span>
                    <span className="font-mono text-slate-500 tabular-nums font-semibold">
                      {cat.count} ({cat.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.max(cat.pct, 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Block Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Hostel Block Load</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {blockStats.map((b) => (
                <div key={b.name} className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                  <div className="text-xs font-bold text-slate-800">{b.name}</div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Active:</span>
                    <span className="font-bold text-amber-600 font-mono">{b.pending}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Total:</span>
                    <span className="font-mono text-slate-700">{b.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Assign Modal */}
      {quickAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Assign Technician to {quickAssignModal.complaintId}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              "{quickAssignModal.complaintTitle}"
            </p>

            <form onSubmit={handleQuickAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Staff Member *
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-blue-600"
                  required
                >
                  <option value="">-- Choose Staff Member --</option>
                  {staffMembers.map((s) => (
                    <option key={s.user_id} value={s.user_id}>
                      {s.full_name} ({s.specialty || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Warden Instructions / Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please repair before evening inspection"
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickAssignModal(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                >
                  Dispatch Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
