import request from '@/utils/request'
import { allMsgs } from '@/config/message'
export const uploadFile = (file) => request.post({ url: '/system/upfile', file }, { show: true, message: allMsgs.upload })
export const login = (data) => request.post({ url: '/system/admin/login',  data }, { show: true })
export const logout = () => request.post({ url: '/system/admin/logout' }, { show: true, message: allMsgs.logout })
export const getLogList = (params) => request.get({ url: '/system/admin/loglist', params })
