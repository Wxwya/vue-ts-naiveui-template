import request from '@/utils/request'
import { allMsgs } from '@/config/message'
export const uploadFile = (file: FormData) => request.post<{url:string}>({ url: '/system/upfile', file }, { show: true, message: allMsgs.upload })
export const login = (data: any) => request.post<any>({ url: '/system/login', method: 'post', data }, { show: true })
export const logout = () => request.post({ url: '/system/logout', method: 'post' }, { show: true, message: allMsgs.logout })
export const getLogList = (params: any) => request.get<Log.GetLoggerListApi>({ url: '/system/loglist', params })
