declare namespace Department {
  interface DepartmentRow {
    id: number
    name: string
    description: string
    status: boolean 
    create_time: string
  }
  interface GetDepartmentListApi {
    list: DepartmentRow[]
    total: number
  }
}
