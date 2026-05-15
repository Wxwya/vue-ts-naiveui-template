import Cookies from "js-cookie"
import { CacheEnums } from "@/enums/cacheEnums";
interface CookieOptions {
  path?: string;
  expires?: Date | number; // 如果是数字，表示秒数；如果是 Date 对象，表示具体的过期时间。
  maxAge?: number; // 同 expires，表示 Cookie 的最大存活时间，单位是秒。
  domain?: string;
  secure?: boolean; // 设置为 true 时，只有 HTTPS 请求才会发送 Cookie。
  sameSite?: "Strict" | "Lax" | "None"; // 控制 Cookie 的 SameSite 属性。
}
type RemoveKey = "local" | "cookie" | "session" | "all";
const cache = {
  local_key: CacheEnums.LOCAL_KEY,
  cookie_key: CacheEnums.COOKIE_KEY,
  session_key: CacheEnums.SESSION_KEY,
  setCookie(key: string, value: unknown, option: CookieOptions = {}) {
    Cookies.set(this.cookie_key + key, value, option)
  },
  getCookie<T = string>(key: string): T | undefined {
    return Cookies.get(this.cookie_key + key) as T | undefined
  },
  setLocalStorage(key: string, value: unknown, expire?: number) {
    const data = JSON.stringify({
      expire: expire ? this.time() + expire : '',
      value,
    })
    localStorage.setItem(this.local_key + key, data)
  },
  getLocalStorage<T = unknown>(key: string): T | null {
    const raw = localStorage.getItem(this.local_key + key)
    if (!raw) return null
    const { value, expire } = JSON.parse(raw)
    if (expire && expire < this.time()) {
      localStorage.removeItem(this.local_key + key)
      return null
    }
    return value as T
  },
  setSessionStorage(key: string, value: unknown) {
    sessionStorage.setItem(this.session_key + key, String(value))
  },
  getSessionStorage<T = string>(key: string): T | null {
    return sessionStorage.getItem(this.session_key + key) as T | null
  },
  clear(key:RemoveKey) {
    if (key === "all") {
      localStorage.clear();
      sessionStorage.clear();
      this.clearCookie()
    }
    if (key === "local") {
      localStorage.clear();
    }
    if (key === "session") {
      sessionStorage.clear();
    }
    if (key === "cookie") {
      this.clearCookie()
    }
  },
  clearCookie() { 
    const allCookies = Cookies.get();
    for (const cookie in allCookies) {
      Cookies.remove(cookie);
    }
  },
  remove(key: string) { 
    localStorage.removeItem(this.local_key+key);
    sessionStorage.removeItem(this.session_key+ key);
    Cookies.remove(this.cookie_key+key);
    
  },
  time(): number{ 
    return Math.round(new Date().getTime() /1000) 
  },
}

export default cache