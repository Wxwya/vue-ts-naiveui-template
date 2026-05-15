import request from "@/utils/request"

export const getDictList = (params: Record<string, unknown>) => request.get<Dict.GetDictListStructApi>({ url: "/admin/dicts", params })
export const getDictInfo = (id: number) => request.get<Dict.DictRow>({ url: `/admin/dicts/details/${id}` })
export const createDict = (data: Record<string, unknown>) => request.post({ url: "/admin/dicts", data }, {show:true})
export const updateDict = (data: Record<string, unknown>) => request.put({ url: `/admin/dicts/${data.id}`, data }, {show:true})
export const delDict = (data: Record<string, unknown>) => request.delete({ url: "/admin/dicts",  data })
export const getDictType = (type: string) => request.get<GlobalOptions[]>({ url: `/dicts/${type}` })
export const getDictTypeList = (params: Record<string, unknown>) => request.get<Dict.GetDictTypeListStructApi>({ url: "/admin/dict-types",  params })
export const delDictType = (data: Record<string, unknown>) => request.delete({ url: "/admin/dict-types",  data },{show:true})
export const createDictType = (data: Record<string, unknown>) => request.post({ url: "/admin/dict-types", data }, {show:true})
export const updateDictType = (data: Record<string, unknown>) => request.put({ url: `/admin/dict-types/${data.id}`, data }, {show:true})
export const changeDictStatus = (data: Record<string, unknown>) => request.patch({ url: `/admin/dicts/${data.id}/status`, data }, { show: true })
export const getDefaultDiceOptions = () => request.get<DefaultOptions[]>({url:"/admin/dicts/default"})
