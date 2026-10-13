import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  CheckCheck,
  Star,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    openComplaintDetails,
  } = useApp();

  const userNotifications = notifications.filter(
    (n) => !currentUser || n.user_id === currentUser.user_id || currentUser.role === 'warden'
  );

  const unreadCount = userNotifications.filter((n) => !n.is_read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'assignment':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'reopened':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'feedback':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity & Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alerts for ticket assignments, technician arrivals, and status changes
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {userNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          No notifications yet. You're all caught up!
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {userNotifications.map((n) => (
            <div
              key={n.notification_id}
              onClick={() => {
                markNotificationRead(n.notification_id);
                if (n.complaint_id) {
                  openComplaintDetails(n.complaint_id);
                }
              }}
              className={`p-4 transition-colors cursor-pointer flex items-start gap-3.5 ${
                !n.is_read ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-xs ${!n.is_read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                    {n.title}
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400 tabular-nums">
                    {new Date(n.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {n.message}
                </p>

                {n.complaint_id && (
                  <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                    <span>Inspect Ticket {n.complaint_id}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>

              {!n.is_read && (
                <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
