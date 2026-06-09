import axiosClient from './axiosClient'

export const categoryApi = {
  list: () => axiosClient.get('/categories'),
  create: (payload) => axiosClient.post('/categories', payload),
  update: (id, payload) => axiosClient.put(`/categories/${id}`, payload),
  remove: (id) => axiosClient.delete(`/categories/${id}`),
}
