import request from "@/utils/request"

export const generateUser = (data: any) => request.post({ url: "/systemUser/generate", method: "post", data })
export const getUserInfo = () => request.get<SystemUser.UserInfo>({ url: "/systemUser/info" })
export const delUser = (data: any) => request.post({ url: "/systemUser/delete", method: "post", data }, {show:true})
export const getUserList = (data: any) => request.post<SystemUser.GetUserListApi>({ url: "/systemUser/list", method: "post", data })
export const changeUserStatus = (data: any) => request.post({url:"/systemUser/status",method:"post",data})
