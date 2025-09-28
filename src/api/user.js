import request from "@/utils/request"

export const generateUser = (data) => request.post({ url: "/admin/user/generate",  data })
export const getUserInfo = () => request.get({ url: "/admin/user/info" })
export const delUser = (data) => request.delete({ url: "/admin/user/delete", data }, {show:true})
export const getUserList = (params) => request.get({ url: "/admin/user/list",  params })
export const changeUserStatus = (data) => request.put({url:"/admin/user/status",data})
