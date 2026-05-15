import request from '@/utils/request'
export const createRole = (data: Record<string, unknown>) => request.post({ url: '/admin/roles', data })
export const updateRole = (data: Record<string, unknown>) => request.put({ url: `/admin/roles/${data.id}`, data })
export const getRoleInfo = (id: number) => request.get<Role.RoleRow>({ url: `/admin/roles/${id}` })
export const getRoleList = (params: Record<string, unknown>) => request.get<Role.GetRoleListApi>({ url: '/admin/roles', params })
export const getRoleOption = () => request.get<GlobalOptions<number>[]>({ url: '/admin/roles/options' })
export const delRole = (data: Record<string, unknown>) => request.delete({ url: '/admin/roles', data }, {show:true})
