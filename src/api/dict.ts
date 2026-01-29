import request from "@/utils/request"

export const getDictList = (params: any) => request.get<Dict.GetDictListStructApi>({ url: "/admin/dicts", params })
export const getDictInfo = (id: any) => request.get<Dict.DictInfo>({ url: `/admin/dicts/details/${id}` })
export const generateDict = (data: any) => request.post({ url: "/admin/dicts", data }, {show:true})
export const delDict = (data: any) => request.delete({ url: "/admin/dicts",  data })
export const getDictType = (type: string) => request.get<GlobalOptions[]>({ url: `/admin/dicts/${type}` })
export const getDictTypeList = (params: any) => request.get<Dict.GetDictTypeListStructApi>({ url: "/admin/dict-types",  params })
export const delDictType = (data: any) => request.delete({ url: "/admin/dict-types",  data },{show:true})
export const generateDictType = (data: any) => request.post({ url: "/admin/dict-types", data }, {show:true})
export const changeDictStatus = (data: any) => request.put({ url: "/admin/dicts/status", data }, { show: true })
export const getDefaultDiceOptions = () => request.get<DefaultOptions[]>({url:"/admin/dicts/default-options"})