import request from "@/utils/request"
export const getDepartmentOptions = () => request.get<GlobalOptions<number>[]>({ url: "/admin/departments/options" })
export const getDepartmentList = (params: Record<string, unknown>) => request.get<Department.GetDepartmentListApi>({ url: "/admin/departments", params })
export const getDepartmentInfo = (id: number) => request.get<Department.DepartmentRow>({ url: `/admin/departments/${id}` })
export const createDepartment = (data: Record<string, unknown>) => request.post({ url: "/admin/departments", data })
export const updateDepartment = (data: Record<string, unknown>) => request.put({ url: `/admin/departments/${data.id}`, data })
export const delDepartment = (data: any) => request.delete({ url: "/admin/departments", data }, { show: true })
export const changeDepartmentStatus = (data: Record<string, unknown>) => request.patch({ url: `/admin/departments/${data.id}/status`, data }, { show: true })
