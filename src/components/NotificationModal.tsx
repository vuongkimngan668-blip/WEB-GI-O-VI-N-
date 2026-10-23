import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationModal: React.FC = () => {
  const { isNotificationOpen, setIsNotificationOpen, notifications, markNotificationAsRead } = useApp();

  if (!isNotificationOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#1266D6]" />
            <h3 className="font-bold text-base text-[#0B2D5C]">
              Thông báo hệ thống ({notifications.length})
            </h3>
          </div>
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 space-y-2.5 max-h-[400px] overflow-y-auto text-xs">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              Không có thông báo mới.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  n.isRead
                    ? 'bg-slate-50 border-slate-100 opacity-70'
                    : 'bg-blue-50/60 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  <div className="mt-0.5">
                    {n.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : n.type === 'warning' ? (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Info className="w-4 h-4 text-[#1266D6]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800">{n.title}</h4>
                      <span className="text-[10px] text-slate-400">{n.date}</span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="px-4 py-2 bg-[#1266D6] text-white text-xs font-bold rounded-xl shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
