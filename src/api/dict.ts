import request from "@/utils/request"

export const getDictList = (params: any) => request.get<Dict.GetDictListStructApi>({ url: "/admin/dict/list", params })
export const getDictInfo = (id: any) => request.get<Dict.DictInfo>({ url: `/admin/dict/info/${id}` })
export const generateDict = (data: any) => request.post({ url: "/admin/dict/generate", data }, {show:true})
export const delDict = (data: any) => request.delete({ url: "/admin/dict/delete",  data })
export const getDictType = (type: string) => request.get<GlobalOptions[]>({ url: `/admin/dict/${type}` })
export const getDictTypeList = (params: any) => request.get<Dict.GetDictTypeListStructApi>({ url: "/admin/dict-type/list",  params })
export const delDictType = (data: any) => request.delete({ url: "/admin/dict-type/delete",  data },{show:true})
export const generateDictType = (data: any) => request.post({ url: "/admin/dict-type/generate", data }, {show:true})
export const changeDictStatus = (data: any) => request.put({ url: "/admin/dict/status", data }, { show: true })
export const getDefaultDiceOptions = () => request.get<DefaultOptions[]>({url:"/admin/dict/default"})