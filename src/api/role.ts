import request from '@/utils/request'
export const generateRole = (data: any) => request.post({ url: '/admin/roles', data })
export const getRoleInfo = (id: any) => request.get<Role.RoleInfo>({ url: `/admin/roles/${id}` })
export const getRoleList = (params: any) => request.get<Role.GetRoleListApi>({ url: '/admin/roles', params })
export const getRoleOption = () => request.get<GlobalOptions<number>[]>({ url: '/admin/roles/options' })
export const delRole = (data: any) => request.delete({ url: '/admin/roles', data }, {show:true})
