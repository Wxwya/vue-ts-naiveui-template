import request from '@/utils/request'
export const generatePermissions = (data: any) => request.post({ url: '/permissions/generate', data })
export const getPermissionsInfo = (id: any) => request.get < Permissions.PermissionsInfo>({ url: `/permissions/info/${id}` })
export const getPermissionsList = (data: any) => request.post <Permissions.GetPermissionsListApi>({ url: '/permissions/list', data })
export const getPermissionsOptions = () => request.get<TreeOptions[]>({ url: '/permissions/options' })
export const delPermissions = (data: any) => request.post({ url: '/permissions/delete', data })
