import api from './axiosInstance';

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ── Complaints ────────────────────────────────────────────────
export const complaintApi = {
  create: (formData) => api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (params) => api.get('/complaints', { params }),
  getMine: (params) => api.get('/complaints', { params: { submittedBy: 'me', ...params } }),
  getById: (id) => api.get(`/complaints/${id}`),
  updateStatus: (id, status) => api.patch(`/complaints/${id}/status`, { status }),
  getDuplicates: (id) => api.get(`/complaints/${id}/duplicates`),
};

// ── Universities ──────────────────────────────────────────────
export const universityApi = {
  getAll: () => api.get('/universities'),
  create: (data) => api.post('/universities', data),
  getChallenges: (id) => api.get(`/universities/${id}/challenges`),
  acceptChallenge: (uniId, complaintId) => api.post(`/universities/${uniId}/accept/${complaintId}`),
};

// ── Projects ──────────────────────────────────────────────────
export const projectApi = {
  getAll: (params) => api.get('/projects', { params }),
  getMine: () => api.get('/projects', { params: { industryPartnerId: 'me' } }),
  getById: (id) => api.get(`/projects/${id}`),
  updateMilestones: (id, data) => api.patch(`/projects/${id}/milestones`, data),
  updateTeam: (id, data) => api.patch(`/projects/${id}/team`, data),
  inviteIndustry: (id, data) => api.post(`/projects/${id}/invite-industry`, data),
  industryResponse: (id, data) => api.patch(`/projects/${id}/industry-response`, data),
};

// ── Industry Partners ─────────────────────────────────────────
export const industryApi = {
  getAll: () => api.get('/industry-partners'),
  create: (data) => api.post('/industry-partners', data),
};

// ── Analytics ─────────────────────────────────────────────────
export const analyticsApi = {
  getSummary: () => api.get('/analytics/summary'),
  getPublicSummary: () => api.get('/analytics/public-summary'),
  getTrends: () => api.get('/analytics/trends'),
  getHotspots: () => api.get('/analytics/hotspots'),
};

// ── Notifications ─────────────────────────────────────────────
export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
};
