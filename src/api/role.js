import request from '@/utils/request'
export const generateRole = (data) => request.post({ url: '/admin/roles', data })
export const getRoleInfo = (id) => request.get({ url: `/admin/roles/${id}` })
export const getRoleList = (params) => request.get({ url: '/admin/roles', params })
export const getRoleOption = () => request.get({ url: '/admin/roles/options' })
export const delRole = (data) => request.delete({ url: '/admin/roles', data })
