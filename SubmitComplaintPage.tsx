import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HOSTEL_BLOCKS,
  CATEGORIES,
  studentRoomImg,
  maintenanceToolsImg,
} from '../data/seedData';
import { ComplaintCategory, ComplaintPriority } from '../types';
import {
  AlertCircle,
  Upload,
  CheckCircle2,
  Building,
  Hash,
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  X,
} from 'lucide-react';

export const SubmitComplaintPage: React.FC = () => {
  const { currentUser, createComplaint, setActiveTab, openComplaintDetails } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('electrical');
  const [priority, setPriority] = useState<ComplaintPriority>('medium');
  const [hostelBlock, setHostelBlock] = useState(currentUser?.hostel_block || HOSTEL_BLOCKS[1]);
  const [roomNumber, setRoomNumber] = useState(currentUser?.room_number || 'B-304');
  const [imagePath, setImagePath] = useState<string>('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePath(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSamplePhoto = (sampleUrl: string) => {
    setImagePath(sampleUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newComplaint = createComplaint({
      title,
      description,
      category,
      priority,
      hostel_block: hostelBlock,
      room_number: roomNumber,
      image_path: imagePath || undefined,
    });

    setSubmittedId(newComplaint.complaint_id);
  };

  if (submittedId) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Complaint Lodged Successfully</h2>
            <p className="text-xs text-slate-500">
              Your service ticket has been routed to the Hostel Warden Office for assignment.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Complaint ID:</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {submittedId}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Room Location:</span>
              <span className="font-semibold text-slate-800">{hostelBlock} · {roomNumber}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Priority Level:</span>
              <span className="font-semibold uppercase text-slate-800">{priority}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => openComplaintDetails(submittedId)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              View Ticket Tracker
            </button>
            <button
              onClick={() => {
                setSubmittedId(null);
                setTitle('');
                setDescription('');
                setImagePath('');
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Submit Hostel Maintenance Complaint</h1>
        <p className="text-xs text-slate-500 mt-1">
          Provide room details, problem category, and priority so the warden can dispatch the appropriate technician.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Category Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as ComplaintCategory)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className={`text-xs font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                    {cat.label}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {cat.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Row: Block & Room */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Hostel Block *</span>
            </label>
            <select
              value={hostelBlock}
              onChange={(e) => setHostelBlock(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:outline-blue-600"
              required
            >
              {HOSTEL_BLOCKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>Room Number *</span>
            </label>
            <input
              type="text"
              placeholder="e.g. B-304"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:outline-blue-600 font-mono"
              required
            >
            </input>
          </div>
        </div>

        {/* Complaint Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Complaint Summary / Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Washroom tap leaking, or Ceiling fan wobbling at high speed"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:outline-blue-600"
            required
          />
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Priority Level *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'low', label: 'Low', desc: 'Minor cosmetic or non-urgent' },
              { id: 'medium', label: 'Medium', desc: 'Standard repair within 24h' },
              { id: 'high', label: 'High', desc: 'Affects daily routine' },
              { id: 'critical', label: 'Critical', desc: 'Hazard, flooding, or safety' },
            ].map((p) => {
              const isSelected = priority === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id as ComplaintPriority)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? p.id === 'critical'
                        ? 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-600/20'
                        : p.id === 'high'
                        ? 'border-orange-500 bg-orange-50 text-orange-900 ring-2 ring-orange-500/20'
                        : 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{p.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Detailed Problem Description *
          </label>
          <textarea
            rows={4}
            placeholder="Please explain the problem clearly. Mention when it started and what is malfunctioning..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:outline-blue-600 leading-relaxed"
            required
          />
        </div>

        {/* Image Attachment (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Attach Photo of Problem (Optional)
          </label>

          {imagePath ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 p-2 bg-slate-50 flex items-center gap-3">
              <img
                src={imagePath}
                alt="Preview"
                className="w-20 h-20 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 text-xs">
                <div className="font-semibold text-slate-900">Photo Attached</div>
                <div className="text-slate-500 text-[11px]">Ready to submit with complaint ticket</div>
              </div>
              <button
                type="button"
                onClick={() => setImagePath('')}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all text-center">
                <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                <span className="text-xs font-semibold text-slate-700">
                  Upload file from your phone or device
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG or WEBP up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Instant Sample Presets for Testing */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">Quick Test Samples:</span>
                <button
                  type="button"
                  onClick={() => handleSamplePhoto(studentRoomImg)}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Room Interior Photo
                </button>
                <button
                  type="button"
                  onClick={() => handleSamplePhoto(maintenanceToolsImg)}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Plumbing Leak Sample
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab(currentUser?.role === 'warden' ? 'warden-dash' : 'student-dash')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center gap-2"
          >
            <span>Submit Maintenance Ticket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
