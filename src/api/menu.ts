
import request from "@/utils/request"
export const createMenu = (data: Record<string, unknown>) => request.post({ url: "/admin/menus", data })
export const updateMenu = (data: Record<string, unknown>) => request.put({ url: `/admin/menus/${data.id}`, data })
export const getMenuList = (params: Record<string, unknown>) => request.get<Menu.GetMenuListApi>({ url: "/admin/menus", params })
export const getMenuInfo = (id: number) => request.get<Menu.MenuRow>({ url: `/admin/menus/${id}` })
export const delMenu = (data: Record<string, unknown>) => request.delete({ url: `/admin/menus`, data }, {show:true})
export const getMenuOptions = () => request.get<TreeOptions[]>({ url: "/admin/menus/options" })
export const changeMenuStatus = (data: Record<string, unknown>) => request.patch({ url: `/admin/menus/${data.id}/status`, data },{show:true})
