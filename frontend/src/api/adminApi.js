import axiosClient from './axiosClient'

export const adminApi = {
  dashboard: () => axiosClient.get('/admin/dashboard'),
  users: () => axiosClient.get('/admin/users'),
  createUser: (payload) => axiosClient.post('/admin/users', payload),
  updateUser: (id, payload) => axiosClient.put(`/admin/users/${id}`, payload),
  removeUser: (id) => axiosClient.delete(`/admin/users/${id}`),
  reports: (params = {}) => axiosClient.get('/admin/reports', { params }),
  exportReports: (params = {}) => axiosClient.get('/admin/reports/export', {
    params,
    responseType: 'blob',
  }),
  activityLogs: (params = {}) => axiosClient.get('/activity-logs', { params }),
}
