import request from '@/utils/request'
export const generatePermissions = (data: any) => request.post({ url: '/admin/permissions', data })
export const getPermissionsInfo = (id: any) => request.get < Permissions.PermissionsInfo>({ url: `/admin/permissions/${id}` })
export const getPermissionsList = (params: any) => request.get<Permissions.GetPermissionsListApi>({ url: '/admin/permissions', params })
export const getPermissionsOptions = () => request.get<TreeOptions[]>({ url: '/admin/permissions/options' })
export const delPermissions = (data: any) => request.delete({ url: '/admin/permissions', data }, {show:true})
