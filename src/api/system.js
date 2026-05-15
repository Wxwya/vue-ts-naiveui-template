import request from '@/utils/request'
import { allMsgs } from '@/config/message'
export const uploadFile = (file) => request.post({ url: '/upload/file', file }, { show: true, message: allMsgs.upload })
export const getLockKeys = () => request.get({ url: '/lock/keys' }, { show: false, excludeLock: true })
export const login = (data) => request.post({ url: '/admin/login', method: 'post', data }, { show: true })
export const logout = () => request.post({ url: '/admin/logout', method: 'post' }, { show: true, message: allMsgs.logout })
export const getLogList = (params) => request.get({ url: '/admin/loggers', params })
