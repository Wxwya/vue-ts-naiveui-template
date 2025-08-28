
import request from "@/utils/request"
export const generateMenu = (data: any) => request.post({ url: "/admin/menu/generate", data })
export const getMenuList = (params: any) => request.get<Menu.GetMenuListApi>({ url: "/admin/menu/list", params })
export const getMenuInfo = (id: any) => request.get<Menu.MenuInfo>({ url: `/admin/menu/info/${id}` })
export const delMenu = (data: any) => request.delete({ url: `/admin/menu/delete`, data }, {show:true})
export const getMenuOptions = () => request.get<TreeOptions[]>({ url: "/admin/menu/options" })
export const changeMenuStatus = (data: any) => request.put({ url: "/admin/menu/status", data },{show:true})