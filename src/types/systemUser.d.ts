
declare namespace SystemUser { 
  interface Route {
    id: number;
    parent_id: number;
    title: string;
    icon: string;
    path: string;
    sort: number;
    hidden: boolean;
    status: boolean;
    create_time: string;
    alwaysShow: boolean;
    children?: Route[];
  }
  interface UserInfo {
    account: string;
    create_time: string;
    id: number;
    last_login_time: string;
    permissions: string[];
    phone: string;
    email:string;
    role_ids: number[];
    role_info: string[];
    routes: Route[];
    status: boolean;
    username: string;
    department_ids:number[]
    is_admin: boolean;
  }
  interface UserReq {
    id: number;
    username: string;
    account: string;
    email: string;
    phone: string;
    password?: string;
    role_ids: number[];
    department_ids: number[];
  }
  interface UserRow {
    id: number;
    username: string;
    account: string;
    email: string;
    phone: string;
    status: boolean;
    is_admin: boolean;
    last_login_time: any;
    roles: Role.RoleRow[];
    departments: any[];
    create_time: string;
  }
  interface GetUserListApi { 
      list: SystemUser.UserRow[]
      total: number
  }
}
