import request from '@/utils/request'
export const createPermissions = (data: Record<string, unknown>) => request.post({ url: '/admin/permissions', data })
export const updatePermissions = (data: Record<string, unknown>) => request.put({ url: `/admin/permissions/${data.id}`, data })
export const getPermissionsInfo = (id: number) => request.get<Permissions.PermissionsRow>({ url: `/admin/permissions/${id}` })
export const getPermissionsList = (params: Record<string, unknown>) => request.get<Permissions.GetPermissionsListApi>({ url: '/admin/permissions', params })
export const getPermissionsOptions = () => request.get<TreeOptions[]>({ url: '/admin/permissions/options' })
export const delPermissions = (data: Record<string, unknown>) => request.delete({ url: '/admin/permissions', data }, {show:true})
