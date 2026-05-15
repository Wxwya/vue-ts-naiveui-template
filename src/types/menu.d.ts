declare namespace Menu {
  interface MenuRow {
    id: number
    parent_id: number
    title: string
    icon: string
    path: string
    sort: number
    hidden: boolean
    always_show: boolean
    status: boolean | null
    create_time: string
  }
  interface GetMenuListApi {
    list: MenuRow[]
    total: number
  }
}
