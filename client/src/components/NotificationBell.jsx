import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, X, CheckCheck, ChevronRight } from 'lucide-react';
import { notificationApi } from '../api/endpoints';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getAll().then(r => r.data),
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const unread = notifications.filter(n => !n.read).length;

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNotificationClick = (n) => {
    markReadMutation.mutate(n._id);
    setOpen(false);
    if (n.relatedId) {
      if (n.type === 'status_change' || n.type === 'duplicate_detected') {
        navigate(`/complaints/${n.relatedId}`);
      } else if (n.type === 'reputation_awarded' || n.type === 'industry_invite') {
        navigate(`/university/projects/${n.relatedId}`);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-navy-800 transition-colors"
        aria-label={`Notifications (${unread} unread)`}
      >
        <Bell size={20} className="text-gray-200" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-saffron-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-2xl border border-gray-200 z-50 animate-slide-down">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-navy-900 rounded-t">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-gray-300" />
              <span className="text-sm font-semibold text-white">Notifications</span>
              {unread > 0 && (
                <span className="text-[10px] bg-saffron-500 text-white px-1.5 py-0.5 rounded-full font-bold">{unread}</span>
              )}
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
              <X size={14} />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                <CheckCheck size={24} className="mx-auto mb-2 text-gray-300" />
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 15).map(n => (
                <button
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors flex items-start gap-3 ${!n.read ? 'bg-blue-50/40' : ''}`}
                >
                  {!n.read && <span className="mt-1.5 w-2 h-2 bg-navy-800 rounded-full flex-shrink-0 animate-pulse-dot" />}
                  {n.read && <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 bg-gray-200" />}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${!n.read ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {n.relatedId && <ChevronRight size={12} className="text-gray-300 flex-shrink-0 mt-1" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
