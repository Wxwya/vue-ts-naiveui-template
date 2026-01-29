
import request from "@/utils/request"
export const generateMenu = (data) => request.post({ url: "/admin/menus", data })
export const getMenuList = (params) => request.get({ url: "/admin/menus",params })
export const getMenuInfo = (id) => request.get({ url: `/admin/menus/${id}` })
export const delMenu = (data) => request.delete({ url: `/admin/menus`, data })
export const getMenuOptions = () => request.get({ url: "/admin/menus/options" })
export const changeMenuStatus = (data) => request.put({ url: "/admin/menus/status", data })