import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { CategoryIcon, getCategoryLabel } from '../components/CategoryIcon';
import { maintenanceToolsImg } from '../data/seedData';
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  PlayCircle,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import { ComplaintStatus } from '../types';

export const StaffDashboard: React.FC = () => {
  const {
    currentUser,
    complaints,
    openComplaintDetails,
    updateComplaintStatus,
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'pending' | 'in_progress' | 'completed'>('in_progress');
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('in_progress');
  const [technicianRemarks, setTechnicianRemarks] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Assigned tickets to current technician
  const myAssignedJobs = complaints.filter(
    (c) =>
      !currentUser ||
      c.assigned_staff_id === currentUser.user_id ||
      // Fallback: if looking at all staff jobs
      currentUser.role !== 'staff'
  );

  const pendingJobs = myAssignedJobs.filter((c) => c.status === 'assigned' || c.status === 'under_review');
  const inProgressJobs = myAssignedJobs.filter((c) => c.status === 'in_progress' || c.status === 'reopened');
  const completedJobs = myAssignedJobs.filter((c) => c.status === 'resolved');

  const visibleJobs =
    activeTabFilter === 'pending'
      ? pendingJobs
      : activeTabFilter === 'in_progress'
      ? inProgressJobs
      : completedJobs;

  const handleQuickStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingTicketId) return;

    updateComplaintStatus(
      updatingTicketId,
      newStatus,
      technicianRemarks || `Updated to ${newStatus} by technician`,
      resolutionNotes || undefined,
      newStatus === 'resolved' ? maintenanceToolsImg : undefined
    );

    setUpdatingTicketId(null);
    setTechnicianRemarks('');
    setResolutionNotes('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Technician Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Technician Workbench: {currentUser?.full_name || 'Maintenance Staff'}
            </h1>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              {currentUser?.specialty || 'General Maintenance Specialist'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Work order execution desk. Inspect job locations, update repair progress, and log resolved items.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <Wrench className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Active Duties: <strong>{inProgressJobs.length} In Progress</strong></span>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTabFilter('pending')}
          className={`p-5 rounded-2xl border text-left transition-all shadow-2xs ${
            activeTabFilter === 'pending'
              ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            New Assigned Jobs
          </div>
          <div className="text-2xl font-bold text-blue-700 font-mono tabular-nums">
            {pendingJobs.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Ready for site inspection</div>
        </button>

        <button
          onClick={() => setActiveTabFilter('in_progress')}
          className={`p-5 rounded-2xl border text-left transition-all shadow-2xs ${
            activeTabFilter === 'in_progress'
              ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Active Repairs
          </div>
          <div className="text-2xl font-bold text-indigo-700 font-mono tabular-nums">
            {inProgressJobs.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tools out / work underway</div>
        </button>

        <button
          onClick={() => setActiveTabFilter('completed')}
          className={`p-5 rounded-2xl border text-left transition-all shadow-2xs ${
            activeTabFilter === 'completed'
              ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Completed Tasks
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            {completedJobs.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Closed & verified by students</div>
        </button>
      </div>

      {/* Task Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {activeTabFilter === 'pending'
                ? 'Assigned Jobs Awaiting Work'
                : activeTabFilter === 'in_progress'
                ? 'Active Repair Work Orders'
                : 'Resolved Tasks Archive'}
            </h2>
            <p className="text-xs text-slate-500">
              Showing {visibleJobs.length} work orders
            </p>
          </div>
        </div>

        {visibleJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
            No work orders in this category currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleJobs.map((c) => (
              <div
                key={c.complaint_id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all p-5 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {c.complaint_id}
                      </span>
                      <PriorityBadge priority={c.priority} />
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                  </div>

                  {/* Room & Student Location Card */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{c.hostel_block} · Room {c.room_number}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px] pt-0.5">
                      <span>Resident: {c.student_name}</span>
                      {c.student_phone && (
                        <span className="font-mono text-blue-700 font-medium">{c.student_phone}</span>
                      )}
                    </div>
                  </div>

                  {c.resolution_notes && (
                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                      <strong>Resolution Notes:</strong> {c.resolution_notes}
                    </div>
                  )}
                </div>

                {/* Technician Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <button
                    onClick={() => openComplaintDetails(c.complaint_id)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Full Details
                  </button>

                  {c.status !== 'resolved' ? (
                    <button
                      onClick={() => {
                        setUpdatingTicketId(c.complaint_id);
                        setNewStatus(c.status === 'assigned' ? 'in_progress' : 'resolved');
                      }}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <span>Update / Resolve</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolved & Signed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Technician Progress Update Modal */}
      {updatingTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Update Repair Status for {updatingTicketId}
            </h3>

            <form onSubmit={handleQuickStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-indigo-600"
                >
                  <option value="in_progress">In Progress (Inspection underway)</option>
                  <option value="resolved">Resolved (Work completed)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Progress Remarks *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Parts replaced, safety checked, no leaks found"
                  value={technicianRemarks}
                  onChange={(e) => setTechnicianRemarks(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-indigo-600"
                  required
                />
              </div>

              {newStatus === 'resolved' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Final Resolution Summary (Shown to Student & Warden)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe what was repaired and instructions for student..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-indigo-600"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdatingTicketId(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                >
                  Save Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
