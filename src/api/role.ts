import request from '@/utils/request'
export const generateRole = (data: any) => request.post({ url: '/role/generate', data })
export const getRoleInfo = (id: any) => request.get<Role.RoleInfo>({ url: `/role/info/${id}` })
export const getRoleList = (data: any) => request.post<Role.GetRoleListApi>({ url: '/role/list', data })
export const getRoleOption = () => request.get<GlobalOptions<number>[]>({ url: '/role/options' })
export const delRole = (data: any) => request.post({ url: '/role/delete', data })
