import HttpRequst from './http'
import { ContentTypeEnum, RequestCodeEnum, RequestMethodsEnum } from '@/enums/requestEnums'
import cache from '@/utils/cache'
import { TokenEnums } from '@/enums/cacheEnums'
import requestCancel from './cancel'
import lock from './lock'
const requestHooks = {
  async beforeRequest(options, config) {
    let newOptions
    if (options?.startRetry) {
      --options.retryCount
      options.controller = new AbortController()
      options.signal = options.controller.signal
      return options
    }
    newOptions = { ...this.options }
    newOptions.url = `${this.options.baseURL}${this.options.prefix ?? ''}${(options?.url ?? '')}`
    newOptions.headers = { ...this.options.headers, ...options?.headers }
    newOptions.method = options?.method || RequestMethodsEnum.GET
    newOptions.params = options?.params || {}
    newOptions.controller = new AbortController()
    newOptions.signal = newOptions.controller.signal
    newOptions.data = options?.data || {}
    newOptions.startRetry = false
    if (newOptions.withToken) {
      const token = cache.getLocalStorage(TokenEnums.TOKEN_KEY)
      newOptions.headTokenKey && (newOptions.headers[newOptions.headTokenKey] = `${newOptions?.tokenPrefix ?? ""}${token}`)
      if (newOptions.stateRefresh) {
        const refreshToken = cache.getLocalStorage(TokenEnums.REFRESH_KEY)
        newOptions.refreshTokenKey && (newOptions.headers[newOptions.refreshTokenKey] = `${newOptions?.tokenPrefix ?? ""}${refreshToken}`)
      }
    }
    
    if ((newOptions.isLockRequest || config?.lockRequest) && !config?.excludeLock && options.data && !!Object.keys(options.data).length) {
      newOptions.data = await lock.encryptionRequestBody(options.data)
    }
    if (newOptions.requestType == 'fetch') {
      newOptions.url += handleParamsString(options?.params || {})
      !!Object.keys(newOptions.data).length && (newOptions.body = JSON.stringify(newOptions.data))
      newOptions.withCredentials && (newOptions.credentials = 'include')
    }
    if (newOptions.repeatRequest) {
      requestCancel.add(newOptions.url, newOptions.controller)
    }
    if (options?.file) {
      // newOptions.headers['Content-Type'] = ContentTypeEnum.FORM_DATA
       delete newOptions.headers['Content-Type']
      newOptions.data = options.file
      newOptions.body = options.file
    }
    return newOptions
  },
  async afterRequest(data, config, response) {
    if ((this.options.isLockRequest || config?.lockRequest) && !config?.excludeLock && data && !!Object.keys(data).length) {
      data = await lock.decryptResponseBody(data) ?? {}
    }
    if (response && (response.status != RequestCodeEnum.SUCCESS)) {
      window.$msg.error(data ? `${data.code}:${JSON.stringify(data.msg)}` : `${response.status}:${response.statusText}`)
      return { code: data ? data.code : response.status, msg: data ? data.msg : response.statusText, data: null }
    }
    if (data) {
      if (data.code === RequestCodeEnum.SUCCESS) {
        config?.show && window.$msg.success(config.message || data.msg || 'ok')
      } else if (RequestCodeEnum.TOKEN_INVALID.includes(data.code)) {
        if (!this.isRefreshing && this.options.stateRefresh && this.options.withToken && !config?.isAuth && data.code === RequestCodeEnum.TOKEN_TIMEOUT) {
          this.isRefreshing = true
          const res = await this.get({ url: this.options?.refreshApi ?? '' }, { show: false, isAuth: true })
          if (res?.code == RequestCodeEnum.SUCCESS) {
            cache.setLocalStorage(TokenEnums.TOKEN_KEY, res.access_token)
            cache.setLocalStorage(TokenEnums.REFRESH_KEY, res.refresh_token)
            !this.isStartTask && this.startTaskRequest()
          }
          return { code: data.code, msg: data.msg, data: null }
        }
        if (!this.isRefreshing || config?.isAuth) {
          cache.remove(TokenEnums.TOKEN_KEY)
          cache.remove(TokenEnums.REFRESH_KEY)
          location.reload()
        }
        return { code: data.code, msg: data.msg, data: 1 }
      } else if (data.code === RequestCodeEnum.SERVER_ERROR) {
        window.$msg.error('请稍后重试....')
      } else {
        window.$msg.error(data.msg || '请求错误')
      }
    }
    if (!config?.isAuth && this.options.stateRefresh) {
      this.removeTask()
    }
    return data
  },
}

const handleParamsString = (params) => {
  const queryParts = [];
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        queryParts.push(`${key}=${encodeURIComponent(v)}`);
      });
    } else if (value) {
      queryParts.push(`${key}=${encodeURIComponent(value)}`);
    }
  });
  return queryParts.length > 0 ? '?' + queryParts.join('&') : '';
}

const defaultOptions = {
  baseURL: import.meta.env.VITE_APP_URL || "",
  prefix: import.meta.env.VITE_APP_PREFIX || "",
  headers: {
    'Content-Type': ContentTypeEnum.JSON,
  },
  withCredentials: true, // 是否开启cookie
  withToken: false, // 是否携带token
  requestHooks: requestHooks, // 请求拦截器
  requestType: 'fetch', // 配置 axios 或 fetch
  retryCount: 2, // 重试次数
  retryTimeout: 5000, // 重试机制时间
  tokenPrefix: 'Bearer ', // token前缀
  headTokenKey: 'Authorization', // 携带头部Token key名称
  refreshTokenKey: 'Refresh-Token',
  refreshApi: '/admin/refresh', // 刷新token接口
  stateRefresh: false, // 是否双token
  timeout: 5000, // 超时机制
  isRetry: true, // 是否开启重试
  repeatRequest: true, // 重复请求机制
  isLockRequest: false, // 是否请求加密
}
const createRequest = (options) => {
  return new HttpRequst({
    ...defaultOptions,
    ...options,
  })
}
const request = createRequest()
export default request
