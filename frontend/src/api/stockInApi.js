import axiosClient from './axiosClient'

export const stockInApi = {
  list: () => axiosClient.get('/stock-ins'),
  detail: (id) => axiosClient.get(`/stock-ins/${id}`),
  create: (payload) => axiosClient.post('/stock-ins', payload),
  update: (id, payload) => axiosClient.put(`/stock-ins/${id}`, payload),
  remove: (id) => axiosClient.delete(`/stock-ins/${id}`),
  upload: (id, formData) => axiosClient.post(`/stock-ins/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}
