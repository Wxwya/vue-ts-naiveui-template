import request from "@/utils/request"

export const getDictList = (params) => request.get({ url: "/admin/dict/list", params })
export const getDictInfo = (id) => request.get({ url: `/admin/dict/info/${id}` })
export const generateDict = (data) => request.post({ url: "/admin/dict/generate", data }, {show:true})
export const delDict = (data) => request.delete({ url: "/admin/dict/delete",  data })
export const getDictType = (type) => request.get({ url: `/admin/dict/${type}` })
export const getDictTypeList = (params) => request.get({ url: "/admin/dict-type/list",  params })
export const delDictType = (data) => request.delete({ url: "/admin/dict-type/delete",  data },{show:true})
export const generateDictType = (data) => request.post({ url: "/admin/dict-type/generate", data }, {show:true})
export const changeDictStatus = (data) => request.put({ url: "/admin/dict/status", data }, { show: true })
export const getDefaultDiceOptions = () => request.get({url:"/admin/dict/default"})