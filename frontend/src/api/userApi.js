import { adminApi } from './adminApi'

export const userApi = {
  list: adminApi.users,
  create: adminApi.createUser,
  update: adminApi.updateUser,
  remove: adminApi.removeUser,
}
