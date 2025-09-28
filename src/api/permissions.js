import request from '@/utils/request'
export const generatePermissions = (data) => request.post({ url: '/admin/permissions/generate', data })
export const getPermissionsInfo = (id) => request.get({ url: `/admin/permissions/info/${id}` })
export const getPermissionsList = (params) => request.get({ url: '/admin/permissions/list', params })
export const getPermissionsOptions = () => request.get({ url: '/admin/permissions/options' })
export const delPermissions = (data) => request.delete({ url: '/admin/permissions/delete', data })
