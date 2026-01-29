import request from "@/utils/request"

export const generateUser = (data: any) => request.post({ url: "/admin/users", method: "post", data })
export const getUserInfo = () => request.get<SystemUser.UserInfo>({ url: "/admin/users/me" })
export const delUser = (data: any) => request.delete({ url: "/admin/users", method: "post", data }, {show:true})
export const getUserList = (params: any) => request.get<SystemUser.GetUserListApi>({ url: "/admin/users", params })
export const changeUserStatus = (data: any) => request.put({url:"/admin/users/status",method:"post",data})
