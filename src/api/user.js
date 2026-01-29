import request from "@/utils/request"

export const generateUser = (data) => request.post({ url: "/admin/users",  data })
export const getUserInfo = () => request.get({ url: "/admin/users/me" })
export const delUser = (data) => request.delete({ url: "/admin/users", data }, {show:true})
export const getUserList = (params) => request.get({ url: "/admin/users",  params })
export const changeUserStatus = (data) => request.put({url:"/admin/users/status",data})
