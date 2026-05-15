declare namespace Role {

  interface RoleRow {
    id: number;
    role_name: string;
    description: string;
    create_time: string;
    permissions_ids?: number[];
    menu_ids?: number[];
    // permissions_ids?:[],
    // menu_ids?:[]
  }
  type RoleTableRow = Omit<Required<Role.RoleRow>, "permissions_ids" | "menu_ids"> 
  interface GetRoleListApi {
    list: RoleTableRow[]
    total: number
  }
}