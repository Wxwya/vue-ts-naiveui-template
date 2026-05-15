import request from "@/utils/request"
export const getConfigList = (params) => request.get({ url: "/admin/system-configs", params })
export const getConfigById = (id) => request.get({ url: `/admin/system-configs/${id}` })
export const createConfig = (data) => request.post({ url: "/admin/system-configs", data },{show:true})
export const updateConfig = (data) => request.put({ url: `/admin/system-configs/${data.id}`, data },{show:true})
export const updateConfigEnable = (data) => request.patch({ url: `/admin/system-configs/${data.id}/enable`, data },{show:true})
export const delConfig = (data) => request.delete({ url: "/admin/system-configs", data }, { show: true })
