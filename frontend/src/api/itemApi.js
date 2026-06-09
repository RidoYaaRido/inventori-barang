import axiosClient from './axiosClient'

export const itemApi = {
  list: (params = {}) => axiosClient.get('/items', { params }),
  detail: (id) => axiosClient.get(`/items/${id}`),
  create: (payload) => axiosClient.post('/items', payload),
  update: (id, payload) => axiosClient.put(`/items/${id}`, payload),
  remove: (id) => axiosClient.delete(`/items/${id}`),
  lowStock: () => axiosClient.get('/items/low-stock'),
}
