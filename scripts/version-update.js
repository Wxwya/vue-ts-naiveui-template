// const fs = require('fs')
// const path = require('path')
import { dirname, resolve} from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pkgPath = resolve(__dirname, '../package.json')
const publicPath = resolve(__dirname, '../public/version.json')
// 1. 读取 package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
// 2. 自动递增 patch 版本
let [major, minor, patch] = pkg.version.split('.').map(Number)
patch += 1
if (patch >= 10) {
  patch = 0
  minor += 1
  if (minor >= 10) {
    minor = 0
    major += 1
  }
}

const newVersion = `${major}.${minor}.${patch}`
pkg.version = newVersion
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

// 5. 写入 public/version.json
fs.writeFileSync(publicPath, JSON.stringify({ version: newVersion }, null, 2))