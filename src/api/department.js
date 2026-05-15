import request from "@/utils/request"
export const getDepartmentOptions = () => request.get({ url: "/admin/departments/options" })
export const getDepartmentList = (params) => request.get({ url: "/admin/departments", params })
export const getDepartmentInfo = (id) => request.get({ url: `/admin/departments/${id}` })
export const createDepartment = (data) => request.post({ url: "/admin/departments", data })
export const updateDepartment = (data) => request.put({ url: `/admin/departments/${data.id}`, data })
export const delDepartment = (data) => request.delete({ url: "/admin/departments", data }, { show: true })
export const changeDepartmentStatus = (data) => request.patch({ url: `/admin/departments/${data.id}/status`, data }, { show: true })
