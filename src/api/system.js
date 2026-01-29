import request from '@/utils/request'
import { allMsgs } from '@/config/message'
export const uploadFile = (file) => request.uploadFile({ url: '/upload ', file }, { show: true, message: allMsgs.upload })
export const login = (data) => request.post({ url: '/admin/login',  data }, { show: true })
export const logout = () => request.post({ url: '/admin/logout' }, { show: true, message: allMsgs.logout })
export const getLogList = (params) => request.get({ url: '/admin/loggers', params })
