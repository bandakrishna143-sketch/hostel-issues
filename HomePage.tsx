import React from 'react';
import { useApp } from '../context/AppContext';
import {
  hostelCampusImg,
  studentRoomImg,
  CATEGORIES,
} from '../data/seedData';
import {
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  PhoneCall,
  UserCheck,
  Wrench,
  GraduationCap,
  Sparkles,
  QrCode,
  FileCheck2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setActiveTab, currentUser, switchRole, complaints, openRoomQR } = useApp();

  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;
  const inProgressCount = complaints.filter((c) => c.status === 'in_progress' || c.status === 'assigned').length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 95;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 rounded-3xl text-white shadow-xl">
        <div className="absolute inset-0 z-0 opacity-35">
          <img
            src={hostelCampusImg}
            alt="Hostel Campus"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-transparent z-0" />

        <div className="relative z-10 max-w-4xl px-8 py-16 sm:px-12 sm:py-20 lg:py-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Centralized Campus Accommodation Maintenance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Fast, Transparent Hostel Maintenance & Complaint Tracking
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Eliminate lost paper registers. Lodge room complaints in seconds, track real-time repair progress, dispatch qualified hostel technicians, and confirm resolutions.
          </p>

          <div className="flex items-center gap-4 pt-2 flex-wrap">
            {currentUser?.role === 'student' ? (
              <button
                onClick={() => setActiveTab('submit')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center gap-2"
              >
                <span>Report Room Issue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : currentUser?.role === 'warden' ? (
              <button
                onClick={() => setActiveTab('manage-complaints')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center gap-2"
              >
                <span>Manage Complaints Queue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : currentUser?.role === 'staff' ? (
              <button
                onClick={() => setActiveTab('staff-dash')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center gap-2"
              >
                <span>Open Assigned Work Orders</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => switchRole('student', 'USR-STU-001')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center gap-2"
              >
                <span>Launch Student Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => openRoomQR('Block B (Bhaskara)', 'B-304')}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-xs"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>Room QR Maintenance Tag</span>
            </button>
          </div>
        </div>
      </section>

      {/* Real-time KPI Stats Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Logged Complaints
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalComplaints}
          </div>
          <div className="text-xs text-slate-500 mt-1">Across Blocks A, B, C & D</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Active Repairs
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono tabular-nums">
            {inProgressCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Technicians currently on-site</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Resolved Issues
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {resolvedCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">{resolutionRate}% resolution efficiency</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Avg Turnaround Time
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
            4.2 hrs
          </div>
          <div className="text-xs text-slate-500 mt-1">From triage to student sign-off</div>
        </div>
      </section>

      {/* Role Hub Quick Access */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Choose Your Operational Portal</h2>
            <p className="text-xs text-slate-500">Instant access for students, hostel administration, and repair staff</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Portal Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-2xs flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Hostel Student
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Report plumbing, electrical, furniture, or Wi-Fi faults in your room. Upload photos, track technician arrivals, and confirm repairs.
              </p>
            </div>
            <button
              onClick={() => switchRole('student', 'USR-STU-001')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors flex items-center justify-between"
            >
              <span>Enter as Alex (Room B-304)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Warden Portal Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-2xs flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Hostel Warden / Admin
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review lodged complaints across blocks, prioritize emergency faults, assign work orders to electricians or plumbers, and export SLA reports.
              </p>
            </div>
            <button
              onClick={() => switchRole('warden', 'USR-WRD-001')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 transition-colors flex items-center justify-between"
            >
              <span>Enter as Dr. Rajesh (Chief Warden)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Maintenance Staff Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-2xs flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Maintenance Staff
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect assigned job cards, access room contact info, update work status, submit repair notes, and mark tasks resolved.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => switchRole('staff', 'USR-STF-001')}
                className="flex-1 py-2 px-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 transition-colors text-center"
              >
                Ramesh (Elec)
              </button>
              <button
                onClick={() => switchRole('staff', 'USR-STF-002')}
                className="flex-1 py-2 px-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 transition-colors text-center"
              >
                Suresh (Plumb)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Categories Supported */}
      <section className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Covered Maintenance Categories</h2>
          <p className="text-xs text-slate-500">Comprehensive facility support across all hostel premises</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
            >
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{cat.label}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works: Editorial Process Steps */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">01. End-to-End Resolution Process</h2>
          <p className="text-xs text-slate-500">Standard operating procedure for every hostel service ticket</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="text-xs font-mono font-bold text-blue-600">STEP 01</div>
            <h3 className="text-sm font-bold text-slate-900">Student Logs Complaint</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student submits issue with room number, category, description, and optional photo attachment.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="text-xs font-mono font-bold text-blue-600">STEP 02</div>
            <h3 className="text-sm font-bold text-slate-900">Warden Triage & Assign</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Warden reviews ticket, adjusts priority, and assigns the appropriate technician immediately.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="text-xs font-mono font-bold text-blue-600">STEP 03</div>
            <h3 className="text-sm font-bold text-slate-900">Technician Repair Work</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assigned staff inspects the room, conducts repair, adds resolution notes, and marks resolved.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="text-xs font-mono font-bold text-blue-600">STEP 04</div>
            <h3 className="text-sm font-bold text-slate-900">Sign-Off & Feedback</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student rates the service from 1-5 stars or reopens the ticket if the problem persists.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Contact Card */}
      <section className="p-6 bg-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>24/7 Hostel Emergency Maintenance Desk</span>
          </div>
          <h3 className="text-lg font-bold">Have an urgent electrical hazard, gas leak, or flooding?</h3>
          <p className="text-xs text-slate-400">
            Call the Central Warden Desk directly for immediate dispatch under 15 minutes.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 bg-slate-800 rounded-xl border border-slate-700 font-mono text-sm font-bold text-white tracking-wider">
            +91 (080) 2891-9900
          </div>
          <button
            onClick={() => setActiveTab('submit')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white transition-colors"
          >
            File Critical Ticket
          </button>
        </div>
      </section>
    </div>
  );
};
