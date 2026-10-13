import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HOSTEL_BLOCKS } from '../data/seedData';
import { Building2, User, Mail, Phone, Lock, Building, Hash, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerStudent, setActiveTab } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hostelBlock, setHostelBlock] = useState(HOSTEL_BLOCKS[0]);
  const [roomNumber, setRoomNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!roomNumber.trim()) {
      setError('Please provide your assigned room number.');
      return;
    }

    const res = registerStudent({
      full_name: fullName,
      email,
      phone,
      hostel_block: hostelBlock,
      room_number: roomNumber.toUpperCase(),
      password,
    });

    if (!res.success) {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Student Room Registration</h1>
        <p className="text-xs text-slate-500">
          Create an account to report issues, track repairs, and manage room maintenance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Student Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="e.g. Maya Krishnan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-blue-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Institutional Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              placeholder="e.g. maya.krishnan@hostel.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-blue-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Contact Mobile Number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-blue-600 font-mono"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hostel Block *
            </label>
            <select
              value={hostelBlock}
              onChange={(e) => setHostelBlock(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900 focus:outline-blue-600"
            >
              {HOSTEL_BLOCKS.map((b) => (
                <option key={b} value={b}>
                  {b.split(' ')[0]} {b.split(' ')[1]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Room Number *
            </label>
            <input
              type="text"
              placeholder="e.g. A-204"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-blue-600 font-mono"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Create Password *
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
          <span>Complete Registration</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Already have an account? Sign In
          </button>
        </div>
      </form>
    </div>
  );
};
