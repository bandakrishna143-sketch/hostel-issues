import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Building,
  Mail,
  Phone,
  Shield,
  QrCode,
  Calendar,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    openRoomQR,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetToDefaults,
  } = useApp();

  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!currentUser) return null;

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const ok = importDatabaseJSON(text);
        if (ok) {
          setImportStatus('Database successfully restored from JSON backup.');
        } else {
          setImportStatus('Failed to parse database backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Profile & Hostel Information</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Account credentials, room assignment, and accommodation maintenance policies
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            {currentUser.full_name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{currentUser.full_name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {currentUser.role}
              </span>
              <span className="text-xs text-slate-400 font-mono">{currentUser.user_id}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address</span>
            </span>
            <div className="font-semibold text-slate-800">{currentUser.email}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Contact Phone</span>
            </span>
            <div className="font-semibold text-slate-800 font-mono">{currentUser.phone}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Assigned Hostel Block</span>
            </span>
            <div className="font-semibold text-slate-800">{currentUser.hostel_block}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Room Number</span>
            </span>
            <div className="font-semibold text-slate-800 font-mono">{currentUser.room_number}</div>
          </div>
        </div>

        {currentUser.role === 'student' && (
          <div className="pt-2">
            <button
              onClick={() => openRoomQR(currentUser.hostel_block, currentUser.room_number)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>View & Print Room Maintenance QR Placard</span>
            </button>
          </div>
        )}
      </div>

      {/* Hostel Maintenance Charter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Hostel Maintenance Guidelines & Charter</h3>
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <strong className="text-slate-900 block mb-0.5">1. Routine Service Hours:</strong>
            Routine electrical and plumbing repairs are carried out Monday through Saturday from 9:00 AM to 6:00 PM. Technicians will knock and state their badge name before entry.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <strong className="text-slate-900 block mb-0.5">2. Emergency Incidents:</strong>
            Active water leaks, short-circuits, fire alarms, and broken locks receive 24/7 priority response within 15–30 minutes through the Central Warden Desk.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <strong className="text-slate-900 block mb-0.5">3. Sign-off & Quality Assurance:</strong>
            Students must verify work completion within 48 hours or click "Reopen" if the problem persists. All repairs are backed by a 30-day warranty.
          </div>
        </div>
      </div>

      {/* Administrative Data Export / Backup Utility */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Database & System Utilities</h3>
        <p className="text-xs text-slate-500">
          Export full database snapshot or restore pre-configured demonstration data.
        </p>

        {importStatus && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={exportDatabaseJSON}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Database JSON</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup JSON</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>

          <button
            onClick={resetToDefaults}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition-colors border border-rose-200 ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset To Default Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
