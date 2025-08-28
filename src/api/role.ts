import request from '@/utils/request'
export const generateRole = (data: any) => request.post({ url: '/admin/role/generate', data })
export const getRoleInfo = (id: any) => request.get<Role.RoleInfo>({ url: `/admin/role/info/${id}` })
export const getRoleList = (params: any) => request.get<Role.GetRoleListApi>({ url: '/admin/role/list', params })
export const getRoleOption = () => request.get<GlobalOptions<number>[]>({ url: '/admin/role/options' })
export const delRole = (data: any) => request.delete({ url: '/admin/role/delete', data })
