declare namespace Permissions {
  interface PermissionsRow { 
    id: number;
    permission_name: string;
    description: string;
    parent_id: number;
    create_time: string;
  }
  interface GetPermissionsListApi  {
    list: PermissionsRow[]
    total: number
  }
}