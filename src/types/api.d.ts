type Api = {
  system: {
    login: (data: any) => Promise<DecryptBody<any>>,
    logout: () => Promise<DecryptBody>,
    getLogList: (data: any) => Promise<DecryptBody<Log.GetLoggerListApi>>,
    uploadFile: (data: any) => Promise<DecryptBody<string>>,
  },
  user: {
    getUserinfo: () => Promise<DecryptBody<SystemUser.UserInfo>>,
    generateUser: (data: any) => Promise<DecryptBody>,
    delUser: (data: any) => Promise<DecryptBody>,
    changeUserStatus: (data: any) => Promise<DecryptBody>,
    getUserList: <T>(data: any) => Promise<DecryptBody<SystemUser.GetUserListApi>>,
  },
  role: {
    getRoleList: (data: any) => Promise<DecryptBody<Role.GetRoleListApi>>,
    getRoleInfo: (id: any) => Promise<DecryptBody<Role.RoleInfo>>,
    generateRole:(data: any) => Promise<DecryptBody>,
    delRole:(data: any) => Promise<DecryptBody>,
    getRoleOption: () => Promise<DecryptBody<GlobalOptions<number>[]>>,
  },
  menu: {
    getMenuList: (data: any) => Promise<DecryptBody<Menu.GetMenuListApi>>,
    getMenuOptions: () => Promise<DecryptBody<TreeOptions[]>>,
    generateMenu: (data: any) => Promise<DecryptBody>,
    delMenu: (data: any) => Promise<DecryptBody>,
    getMenuInfo: (id: any) => Promise<DecryptBody<Menu.MenuInfo>>,
    changeMenuStatus: (data: any) => Promise<DecryptBody>,
  },
  permissions: {
    getPermissionsList: (data: any) => Promise<DecryptBody<Permissions.GetPermissionsListApi>>,
    generatePermissions: (data: any) => Promise<DecryptBody>,
    delPermissions: (data: any) => Promise<DecryptBody>,
    getPermissionsInfo: (id: any) => Promise<DecryptBody<Permissions.PermissionsInfo>>,
    getPermissionsOptions: () => Promise<DecryptBody<TreeOptions>>,
  },
  dict: {
    getDictList: (data: any) => Promise<DecryptBody<Dict.GetDictListStructApi>>,
    generateDict: (data: any) => Promise<DecryptBody>,
    delDict: (data: any) => Promise<DecryptBody>,
    getDictInfo: (id: any) => Promise<DecryptBody<Dict.DictInfo>>,
    getDictType: (type: string) => Promise<DecryptBody<GlobalOptions[]>>,
    getDictTypeList: (data: any) => Promise<DecryptBody<Dict.GetDictListStructApi>>,
    delDictType: (data: any) => Promise<DecryptBody>,
    generateDictType: (data: any) => Promise<DecryptBody>,
    changeDictStatus: (data: any) => Promise<DecryptBody>,
    getDefaultDiceOptions: (data: any) => Promise<DecryptBody<DefaultOptions[]>>,
  }
}