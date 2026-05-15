import request from "@/utils/request"

export const getDictList = (params) => request.get({ url: "/admin/dicts", params })
export const getDictInfo = (id) => request.get({ url: `/admin/dicts/details/${id}` })
export const createDict = (data) => request.post({ url: "/admin/dicts", data }, {show:true})
export const updateDict = (data) => request.put({ url: `/admin/dicts/${data.id}`, data }, {show:true})
export const delDict = (data) => request.delete({ url: "/admin/dicts", data })
export const getDictType = (type) => request.get({ url: `/dicts/${type}` })
export const getDictTypeList = (params) => request.get({ url: "/admin/dict-types", params })
export const delDictType = (data) => request.delete({ url: "/admin/dict-types", data },{show:true})
export const createDictType = (data) => request.post({ url: "/admin/dict-types", data }, {show:true})
export const updateDictType = (data) => request.put({ url: `/admin/dict-types/${data.id}`, data }, {show:true})
export const changeDictStatus = (data) => request.patch({ url: `/admin/dicts/${data.id}/status`, data }, { show: true })
export const getDefaultDiceOptions = () => request.get({url:"/admin/dicts/default"})
