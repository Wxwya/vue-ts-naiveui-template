import request from '@/utils/request'
export const generateRole = (data) => request.post({ url: '/admin/role/generate', data })
export const getRoleInfo = (id) => request.get({ url: `/admin/role/info/${id}` })
export const getRoleList = (params) => request.get({ url: '/admin/role/list', params })
export const getRoleOption = () => request.get({ url: '/admin/role/options' })
export const delRole = (data) => request.delete({ url: '/admin/role/delete', data })
