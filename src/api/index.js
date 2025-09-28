let api = {}
const modules = import.meta.glob('./*.js', { eager: true })

for (const path in modules) {
  const name = path.split(/[\/\.]/)[2]
   api[name]=modules[path]
}

export default api