let api = {}
const modules = import.meta.glob <{ [key: string]:any }>('./*.ts', { eager: true })
for (const path in modules) {
  const name = path.split(/[\/\.]/)[2]
   api[name]=modules[path]
}
export default api as Api