
import request from "@/utils/request"
export const generateMenu = (data) => request.post({ url: "/admin/menu/generate", data })
export const getMenuList = (params) => request.get({ url: "/admin/menu/list",params })
export const getMenuInfo = (id) => request.get({ url: `/admin/menu/info/${id}` })
export const delMenu = (data) => request.delete({ url: `/admin/menu/delete`, data })
export const getMenuOptions = () => request.get({ url: "/admin/menu/options" })
export const changeMenuStatus = (data) => request.put({ url: "/admin/menu/status", data })