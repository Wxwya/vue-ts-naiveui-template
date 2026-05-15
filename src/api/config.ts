import request from "@/utils/request"
export const getConfigList = (params: Record<string, unknown>) => request.get<SystemConfig.ConfigRow[]>({ url: "/admin/system-configs", params })
export const getConfigById = (id: number) => request.get<SystemConfig.ConfigRow>({ url: `/admin/system-configs/${id}` })
export const createConfig = (data: Record<string, unknown>) => request.post({ url: "/admin/system-configs", data })
export const updateConfig = (data: Record<string, unknown>) => request.put({ url: `/admin/system-configs/${data.id}`, data })
export const updateConfigEnable = (data: Record<string, unknown>) => request.patch({ url: `/admin/system-configs/${data.id}/enable`, data })
export const delConfig = (data: any) => request.delete({ url: "/admin/system-configs", data }, { show: true })
