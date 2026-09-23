import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notificationApi } from '../api/endpoints';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import {
  Bell, CheckCheck, Clock, ChevronRight, CheckCircle2,
  AlertTriangle, Sparkles, Filter
} from 'lucide-react';

export default function Notifications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const { data: notifications = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['notifications-page'],
    queryFn: () => notificationApi.getAll().then(r => r.data || []),
    staleTime: 15000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications-page'] }),
  });

  if (isLoading) return <LoadingSpinner message="Fetching notification logs..." />;
  if (isError) return <ErrorState onRetry={refetch} message="Failed to load notifications." />;

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const handleClick = (n) => {
    if (!n.read) {
      markReadMutation.mutate(n._id);
    }
    if (n.relatedId) {
      if (n.type === 'status_change' || n.type === 'duplicate_detected') {
        navigate(`/complaints/${n.relatedId}`);
      } else if (n.type === 'reputation_awarded' || n.type === 'industry_invite' || n.type === 'industry_response') {
        navigate(`/university/projects/${n.relatedId}`);
      }
    }
  };

  const handleMarkAll = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await notificationApi.markRead(n._id);
    }
    queryClient.invalidateQueries({ queryKey: ['notifications-page'] });
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge bg-navy-900 text-white">Activity Log</span>
              <span className="text-xs text-gray-500">Live civic alerts</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-navy-900 mt-1">Notification Center</h1>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy-800 bg-navy-50 hover:bg-navy-100 rounded-lg border border-navy-200"
              >
                <CheckCheck size={14} /> Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'all' ? 'bg-navy-900 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'unread' ? 'bg-navy-900 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title={filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
            message="Status updates, university assignments, and reputation alerts will appear here."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {filtered.map(n => (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !n.read ? 'bg-blue-50/40' : ''
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-navy-800 animate-pulse' : 'bg-gray-300'}`} />
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm leading-relaxed ${!n.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                      <Clock size={10} />
                      {new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      <span className="capitalize badge bg-gray-100 text-gray-600 text-[9px]">
                        {n.type?.replace('_', ' ') || 'Alert'}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight size={16} className="text-gray-400 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
