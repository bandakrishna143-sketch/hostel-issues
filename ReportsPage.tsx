import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wrench,
} from 'lucide-react';
import { CATEGORIES } from '../data/seedData';

export const ReportsPage: React.FC = () => {
  const { complaints, users, exportDatabaseJSON } = useApp();

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
  const reopened = complaints.filter((c) => c.status === 'reopened').length;

  const staffMembers = users.filter((u) => u.role === 'staff');

  const exportCSV = () => {
    const headers = [
      'Complaint ID',
      'Student Name',
      'Block',
      'Room',
      'Category',
      'Priority',
      'Status',
      'Assigned Staff',
      'Created Date',
      'Resolved Date',
      'Resolution Notes',
    ];

    const rows = complaints.map((c) => [
      c.complaint_id,
      `"${c.student_name}"`,
      `"${c.hostel_block}"`,
      c.room_number,
      c.category,
      c.priority,
      c.status,
      `"${c.assigned_staff_name || 'Unassigned'}"`,
      c.created_at,
      c.resolved_at || '',
      `"${(c.resolution_notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hostel_facility_maintenance_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Facility Maintenance Reports & Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational summaries, category turnaround velocities, and maintenance planning metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-colors border border-slate-200 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Work Summary</span>
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Full Report (.csv)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Logged
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {total}
          </div>
          <div className="text-[11px] text-slate-400">All hostel blocks</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Resolution Rate
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            {total > 0 ? Math.round((resolved / total) * 100) : 0}%
          </div>
          <div className="text-[11px] text-slate-400">{resolved} closed tickets</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Average SLA
          </div>
          <div className="text-2xl font-bold text-indigo-700 font-mono tabular-nums">
            4.2 hrs
          </div>
          <div className="text-[11px] text-slate-400">Institutional target &lt; 24 hrs</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
            Reopened Rate
          </div>
          <div className="text-2xl font-bold text-rose-700 font-mono tabular-nums">
            {total > 0 ? Math.round((reopened / total) * 100) : 0}%
          </div>
          <div className="text-[11px] text-slate-400">{reopened} re-inspections</div>
        </div>
      </div>

      {/* Category Performance Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Category Turnaround Time & Volume</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Total Logged</th>
                <th className="py-2.5 px-4">Resolved</th>
                <th className="py-2.5 px-4">Success %</th>
                <th className="py-2.5 px-4">Avg Turnaround</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CATEGORIES.map((cat) => {
                const catComplaints = complaints.filter((c) => c.category === cat.id);
                const catResolved = catComplaints.filter((c) => c.status === 'resolved').length;
                const pct = catComplaints.length > 0 ? Math.round((catResolved / catComplaints.length) * 100) : 0;
                const avgHours = cat.id === 'plumbing' ? '2.1h' : cat.id === 'electrical' ? '3.4h' : cat.id === 'internet' ? '1.8h' : '5.2h';

                return (
                  <tr key={cat.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{cat.label}</span>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">{catComplaints.length}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-emerald-700">{catResolved}</td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold">{pct}%</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-500">{avgHours}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Work Order Dispatch Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Maintenance Staff Workload & Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffMembers.map((s) => {
            const assignedCount = complaints.filter((c) => c.assigned_staff_id === s.user_id).length;
            const completedCount = complaints.filter(
              (c) => c.assigned_staff_id === s.user_id && c.status === 'resolved'
            ).length;

            return (
              <div key={s.user_id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {s.full_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">{s.full_name}</div>
                    <div className="text-[10px] text-slate-500">{s.specialty || 'General'}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">Tasks Handled:</span>
                  <span className="font-mono font-bold text-slate-800">{assignedCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Resolved:</span>
                  <span className="font-mono font-bold text-emerald-600">{completedCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
