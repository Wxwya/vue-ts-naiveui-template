declare namespace SystemConfig {
  interface ConfigRow {
    id: number
    key: string
    value: string
    enable: boolean
    remark: string | null
    user_id: number
    create_time: string
  }
}
