
import request from "@/utils/request"
export const generateMenu = (data: any) => request.post({ url: "/menu/generate", data })
export const getMenuList = (data: any) => request.post<Menu.GetMenuListApi>({ url: "/menu/list", data })
export const getMenuInfo = (id: any) => request.get<Menu.MenuInfo>({ url: `/menu/info/${id}` })
export const delMenu = (data: any) => request.post({ url: `/menu/delete`, data })
export const getMenuOptions = () => request.get<TreeOptions[]>({ url: "/menu/options" })
export const changeMenuStatus = (data: any) => request.post({ url: "/menu/status", data })