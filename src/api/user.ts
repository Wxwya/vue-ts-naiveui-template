import request from "@/utils/request"

export const generateUser = (data: any) => request.post({ url: "/admin/user/generate", method: "post", data })
export const getUserInfo = () => request.get<SystemUser.UserInfo>({ url: "/admin/user/info" })
export const delUser = (data: any) => request.delete({ url: "/admin/user/delete", method: "post", data }, {show:true})
export const getUserList = (params: any) => request.get<SystemUser.GetUserListApi>({ url: "/admin/user/list", params })
export const changeUserStatus = (data: any) => request.put({url:"/admin/user/status",method:"post",data})
