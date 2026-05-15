import request from '@/utils/request'
export const createPermissions = (data) => request.post({ url: '/admin/permissions', data })
export const updatePermissions = (data) => request.put({ url: `/admin/permissions/${data.id}`, data })
export const getPermissionsInfo = (id) => request.get({ url: `/admin/permissions/${id}` })
export const getPermissionsList = (params) => request.get({ url: '/admin/permissions', params })
export const getPermissionsOptions = () => request.get({ url: '/admin/permissions/options' })
export const delPermissions = (data) => request.delete({ url: '/admin/permissions', data }, {show:true})
