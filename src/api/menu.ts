
import request from "@/utils/request"
export const generateMenu = (data: any) => request.post({ url: "/admin/menus", data })
export const getMenuList = (params: any) => request.get<Menu.GetMenuListApi>({ url: "/admin/menus", params })
export const getMenuInfo = (id: any) => request.get<Menu.MenuInfo>({ url: `/admin/menus/${id}` })
export const delMenu = (data: any) => request.delete({ url: `/admin/menus`, data }, {show:true})
export const getMenuOptions = () => request.get<TreeOptions[]>({ url: "/admin/menus/options" })
export const changeMenuStatus = (data: any) => request.put({ url: "/admin/menus/status", data },{show:true})