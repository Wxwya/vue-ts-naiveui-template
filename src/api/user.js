import request from "@/utils/request"

export const createUser = (data) => request.post({ url: "/admin/users", data })
export const updateUser = (data) => request.put({ url: `/admin/users/${data?.id}`, data })
export const getUserInfo = () => request.get({ url: "/admin/users/me" })
export const delUser = (data) => request.delete({ url: "/admin/users", data }, {show:true})
export const getUserList = (params) => request.get({ url: "/admin/users", params })
export const changeUserStatus = (data) => request.patch({ url: `/admin/users/${data.id}/status`, data },{show:true})
