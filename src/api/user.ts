import request from "@/utils/request"

export const createUser = (data: Record<string, unknown>) => request.post({ url: "/admin/users", data })
export const updateUser = (data: Record<string, unknown>) => request.put({ url: `/admin/users/${data?.id}`, data })
export const getUserInfo = () => request.get<SystemUser.UserInfo>({ url: "/admin/users/me" })
export const delUser = (data: Record<string, unknown>) => request.delete({ url: "/admin/users",  data }, {show:true})
export const getUserList = (params: Record<string, unknown>) => request.get<SystemUser.GetUserListApi>({ url: "/admin/users", params })
export const changeUserStatus = (data: Record<string, unknown>) => request.patch({ url: `/admin/users/${data.id}/status`, data },{show:true})
