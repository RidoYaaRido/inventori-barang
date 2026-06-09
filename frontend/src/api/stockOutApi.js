import axiosClient from './axiosClient'

export const stockOutApi = {
  list: () => axiosClient.get('/stock-outs'),
  detail: (id) => axiosClient.get(`/stock-outs/${id}`),
  create: (payload) => axiosClient.post('/stock-outs', payload),
  update: (id, payload) => axiosClient.put(`/stock-outs/${id}`, payload),
  remove: (id) => axiosClient.delete(`/stock-outs/${id}`),
  upload: (id, formData) => axiosClient.post(`/stock-outs/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}
