import Cookies from "js-cookie"
import { CacheEnums } from "@/enums/cacheEnums";

const cache = {
  local_key: CacheEnums.LOCAL_KEY,
  cookie_key: CacheEnums.COOKIE_KEY,
  session_key: CacheEnums.SESSION_KEY,
  setCookie(key, value, option) { 
    Cookies.set(this.cookie_key + key, value, option)
  },
  getCookie(key){ 
    return Cookies.get(this.cookie_key + key)
  },
  setLocalStorage(key, value, expire) { 
    let data= {
      expire: expire ? this.time() + expire : "",
      value,
    };
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }
    localStorage.setItem(this.local_key + key, data)
  },
  getLocalStorage(key) { 
    let data = localStorage.getItem(this.local_key + key)
    if (!data) {
      return null;
    }
    const { value, expire } = JSON.parse(data);
    if (expire && expire < this.time()) {
      localStorage.removeItem(this.local_key + key)
      return null;
    }
    return  value
  },
  setSessionStorage(key, value) { 
    sessionStorage.setItem(this.session_key + key, value)
  },
  getSessionStorage(key){ 
    return sessionStorage.getItem(this.session_key + key)
  },
  clear(key) {
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
  remove(key) { 
    localStorage.removeItem(this.local_key+key);
    sessionStorage.removeItem(this.session_key+ key);
    Cookies.remove(this.cookie_key+key);
    
  },
  time(){ 
    return Math.round(new Date().getTime() /1000) 
  },
}

export default cache