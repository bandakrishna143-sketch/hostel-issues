import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { CategoryIcon, getCategoryLabel } from '../components/CategoryIcon';
import {
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  QrCode,
  ArrowRight,
  Star,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    complaints,
    feedbacks,
    openComplaintDetails,
    setActiveTab,
    openRoomQR,
  } = useApp();

  // Filter complaints belonging to the current student
  const studentComplaints = complaints.filter(
    (c) => !currentUser || c.student_id === currentUser.user_id
  );

  const activeCount = studentComplaints.filter(
    (c) => c.status === 'submitted' || c.status === 'under_review' || c.status === 'assigned'
  ).length;

  const inProgressCount = studentComplaints.filter((c) => c.status === 'in_progress').length;
  const resolvedCount = studentComplaints.filter((c) => c.status === 'resolved').length;

  // Resolved complaints that don't have feedback yet
  const pendingFeedbackComplaints = studentComplaints.filter(
    (c) => c.status === 'resolved' && !feedbacks.some((f) => f.complaint_id === c.complaint_id)
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Welcome back, {currentUser?.full_name || 'Student'}
            </h1>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {currentUser?.hostel_block || 'Block B'} · {currentUser?.room_number || 'B-304'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Monitor repairs for your room, communicate with technicians, and confirm service quality.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() =>
              openRoomQR(currentUser?.hostel_block || 'Block B (Bhaskara)', currentUser?.room_number || 'B-304')
            }
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
          >
            <QrCode className="w-3.5 h-3.5 text-slate-600" />
            <span>Room Door QR</span>
          </button>

          <button
            onClick={() => setActiveTab('submit')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Lodge New Complaint</span>
          </button>
        </div>
      </div>

      {/* Pending Feedback Banner if any */}
      {pendingFeedbackComplaints.length > 0 && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
              <Star className="w-5 h-5 fill-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900">
                Action Required: {pendingFeedbackComplaints.length} Resolved Repair Needs Your Rating
              </div>
              <div className="text-xs text-emerald-700">
                Ticket {pendingFeedbackComplaints[0].complaint_id} ({pendingFeedbackComplaints[0].title}) has been marked complete. Please confirm resolution.
              </div>
            </div>
          </div>
          <button
            onClick={() => openComplaintDetails(pendingFeedbackComplaints[0].complaint_id)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
          >
            Review & Rate
          </button>
        </div>
      )}

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Triage / Assigned
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {activeCount}
          </div>
          <div className="text-[11px] text-slate-500">Awaiting technician arrival</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            In Progress
          </div>
          <div className="text-2xl font-bold text-indigo-600 font-mono tabular-nums">
            {inProgressCount}
          </div>
          <div className="text-[11px] text-slate-500">Repair active on site</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Resolved Issues
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-slate-500">Successfully closed tickets</div>
        </div>
      </div>

      {/* Complaint List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Room Complaints</h2>
            <p className="text-xs text-slate-500">History of all maintenance tickets filed for your room</p>
          </div>
          <button
            onClick={() => setActiveTab('my-complaints')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {studentComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No complaints on file</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't reported any problems yet. If you have an electrical, plumbing, or room defect, lodge a complaint anytime.
            </p>
            <button
              onClick={() => setActiveTab('submit')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Report First Issue
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {studentComplaints.map((c) => (
              <div
                key={c.complaint_id}
                onClick={() => openComplaintDetails(c.complaint_id)}
                className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {c.complaint_id}
                    </span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                    <span className="text-slate-400 text-xs">·</span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CategoryIcon category={c.category} className="w-3.5 h-3.5" />
                      <span>{getCategoryLabel(c.category)}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-1 max-w-2xl">
                    {c.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-0.5">
                    <span>Lodged: {new Date(c.created_at).toLocaleDateString()}</span>
                    {c.assigned_staff_name && (
                      <span>Assigned to: <strong className="text-slate-600">{c.assigned_staff_name}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openComplaintDetails(c.complaint_id);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                  >
                    View Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
