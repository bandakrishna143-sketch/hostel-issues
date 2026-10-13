import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchRole, setActiveTab } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(email, password);
    if (!res.success) {
      setError(res.error || 'Authentication failed');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Sign in to Hostel Portal</h1>
        <p className="text-xs text-slate-500">
          Access your room complaints, maintenance assignments, and warden logs
        </p>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Institutional Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              placeholder="e.g. alex.sharma@hostel.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-blue-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-blue-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
        >
          <span>Log In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            New resident? Register your room account
          </button>
        </div>
      </form>

      {/* 1-Click Fast Demo Credentials */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>One-Click Evaluation Accounts</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => switchRole('student', 'USR-STU-001')}
            className="w-full py-2 px-3 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-left flex items-center justify-between"
          >
            <div>
              <span className="font-semibold text-slate-900">Alex Sharma</span>
              <span className="text-[11px] text-slate-500 ml-2">Student · Room B-304</span>
            </div>
            <span className="text-blue-600 font-medium text-[11px]">Instant Log In →</span>
          </button>

          <button
            type="button"
            onClick={() => switchRole('warden', 'USR-WRD-001')}
            className="w-full py-2 px-3 bg-white hover:bg-amber-50 border border-slate-200 rounded-lg text-left flex items-center justify-between"
          >
            <div>
              <span className="font-semibold text-slate-900">Dr. Rajesh Kumar</span>
              <span className="text-[11px] text-slate-500 ml-2">Chief Warden / Admin</span>
            </div>
            <span className="text-amber-700 font-medium text-[11px]">Instant Log In →</span>
          </button>

          <button
            type="button"
            onClick={() => switchRole('staff', 'USR-STF-001')}
            className="w-full py-2 px-3 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg text-left flex items-center justify-between"
          >
            <div>
              <span className="font-semibold text-slate-900">Ramesh Kumar</span>
              <span className="text-[11px] text-slate-500 ml-2">Senior Electrician</span>
            </div>
            <span className="text-indigo-700 font-medium text-[11px]">Instant Log In →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
