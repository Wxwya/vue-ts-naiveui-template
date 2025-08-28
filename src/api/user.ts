import request from "@/utils/request"

export const generateUser = (data: any) => request.post({ url: "/admin/user/generate",  data })
export const getUserInfo = () => request.get<SystemUser.UserInfo>({ url: "/admin/user/info" })
export const delUser = (data: any) => request.delete({ url: "/admin/user/delete", data }, {show:true})
export const getUserList = (params: any) => request.get<SystemUser.GetUserListApi>({ url: "/admin/user/list",  params })
export const changeUserStatus = (data: any) => request.put({url:"/admin/user/status",data})
