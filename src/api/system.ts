import request from '@/utils/request'
import { allMsgs } from '@/config/message'
export const uploadFile = (file: FormData) => request.post<{url:string}>({ url: '/upload/file', file }, { show: true, message: allMsgs.upload })
export const getLockKeys = () => request.get<{ backend_public_key: string; frontend_private_key: string }>({ url: '/lock/keys' }, { show: false, excludeLock: true })
export const login = (data: Record<string, unknown>) => request.post<{ access_token: string,refresh_token:string }>({ url: '/admin/login', method: 'post', data }, { show: true })
export const logout = () => request.post({ url: '/admin/logout', method: 'post' }, { show: true, message: allMsgs.logout })
export const getLogList = (params: Record<string, unknown>) => request.get<Log.GetLoggerListApi>({ url: '/admin/loggers', params })
