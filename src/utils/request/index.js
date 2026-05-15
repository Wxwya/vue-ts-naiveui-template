import HttpRequst from './http'
import { ContentTypeEnum, RequestCodeEnum, RequestMethodsEnum } from '@/enums/requestEnums'
import cache from '@/utils/cache'
import { TokenEnums } from '@/enums/cacheEnums'
import requestCancel from './cancel'
import lock from './lock'

const isRecord = (value) => typeof value === 'object' && value !== null

const isSuccessStatus = (status) => typeof status === 'number' && status >= 200 && status < 300

const handleParamsString = (params) => {
  const parts = []
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => parts.push(`${key}=${encodeURIComponent(String(v))}`))
    } else if (value !== undefined && value !== null) {
      parts.push(`${key}=${encodeURIComponent(String(value))}`)
    }
  })
  return parts.length > 0 ? '?' + parts.join('&') : ''
}

const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

const isTokenExpired = (token, bufferMs = 20000) => {
  const exp = getTokenExpiry(token)
  return exp !== null && Date.now() > exp - bufferMs
}

const normalizeResponseBody = (payload, response, codeMode = 'data') => {
  const httpStatus = response?.status ?? 0
  const body = isRecord(payload) ? payload : {}
  const businessCode = typeof body.code === 'number' ? body.code : null
  const mode = codeMode === 'auto' ? (businessCode !== null ? 'data' : 'response') : codeMode

  if (mode === 'response') {
    return {
      code: httpStatus,
      message: typeof body.message === 'string' ? body.message : (response?.statusText ?? ''),
      data: (payload ?? null),
      httpStatus,
      mode,
    }
  }

  return {
    code: businessCode ?? httpStatus,
    message: typeof body.message === 'string' ? body.message : (response?.statusText ?? ''),
    data: ('data' in body ? body.data : null),
    httpStatus,
    mode,
  }
}

const doRefreshToken = (that) => {
  if (!that.refreshPromise) {
    that.isRefreshing = true
    that.refreshPromise = that.post({ url: that.options.refreshApi ?? '' }, { show: false, isAuth: true }).then((res) => {
      if (res?.code === RequestCodeEnum.SUCCESS) {
        cache.setLocalStorage(TokenEnums.TOKEN_KEY, res?.data?.access_token)
        cache.setLocalStorage(TokenEnums.REFRESH_KEY, res?.data?.refresh_token)
      } else {
        cache.remove(TokenEnums.TOKEN_KEY)
        cache.remove(TokenEnums.REFRESH_KEY)
      }
      that.startTaskRequest()
      return res
    })
  }
  return that.refreshPromise
}

const requestHooks = {
  async beforeRequest(options, config) {
    const that = this

    if ('startRetry' in options && options.startRetry) {
      --options.retryCount
      options.controller = new AbortController()
      options.signal = options.controller.signal
      return options
    }

    const controller = new AbortController()
    const newOptions = {
      ...that.options,
      url: `${that.options.baseURL ?? ''}${that.options.prefix ?? ''}${options?.url ?? ''}`,
      headers: { ...that.options.headers, ...options?.headers },
      method: options?.method || RequestMethodsEnum.GET,
      params: options?.params || {},
      data: options?.data || {},
      startRetry: false,
      controller,
      signal: controller.signal,
    }

    if (newOptions.withToken) {
      if (newOptions.stateRefresh && !config?.isAuth) {
        const currentToken = cache.getLocalStorage(TokenEnums.TOKEN_KEY)
        if (currentToken && isTokenExpired(currentToken)) {
          await doRefreshToken(that)
        }
      }
      const token = cache.getLocalStorage(TokenEnums.TOKEN_KEY)
      if (newOptions.headTokenKey) {
        newOptions.headers[newOptions.headTokenKey] = `${newOptions.tokenPrefix ?? ''}${token}`
      }
      if (newOptions.stateRefresh && newOptions?.refreshTokenKey) {
        const refresh_token = cache.getLocalStorage(TokenEnums.REFRESH_KEY)
        newOptions.headers[newOptions.refreshTokenKey] = `${newOptions.tokenPrefix ?? ''}${refresh_token}`
      }
    }

    if (newOptions.repeatRequest) {
      requestCancel.add(options.url, newOptions.controller)
    }

    if ((newOptions.isLockRequest || config?.lockRequest) && !config?.excludeLock && isRecord(options.data) && Object.keys(options.data).length) {
      newOptions.data = await lock.encryptionRequestBody(options.data)
    }

    if (newOptions.requestType === 'fetch') {
      newOptions.url += handleParamsString(options?.params || {})
      if (isRecord(newOptions.data) && Object.keys(newOptions.data).length > 0) {
        newOptions.body = JSON.stringify(newOptions.data)
      }
      if (newOptions.withCredentials) newOptions.credentials = 'include'
    }

    if (options?.file) {
      delete newOptions.headers['Content-Type']
      newOptions.data = options.file
      newOptions.body = options.file
    }

    return newOptions
  },

  async afterRequest(data, config, response) {
    const that = this

    if ((that.options.isLockRequest || config?.lockRequest) && !config?.excludeLock && isRecord(data) && Object.keys(data).length) {
      data = (await lock.decryptResponseBody(data)) ?? {}
    }

    const normalized = normalizeResponseBody(data, response, config?.codeMode ?? that.options.codeMode ?? 'data')
    const isSuccess = normalized.mode === 'response' ? isSuccessStatus(normalized.httpStatus) : normalized.code === RequestCodeEnum.SUCCESS

    if (isSuccess) {
      config?.show && window.$msg.success(config?.message || normalized?.message || 'ok')
      return { code: normalized.code, message: normalized.message, data: normalized.data }
    }

    const isTokenInvalid = RequestCodeEnum.TOKEN_INVALID.includes(normalized.code)

    if (isTokenInvalid) {
      const canRefresh =
        !that.isRefreshing &&
        that.options.stateRefresh &&
        that.options.withToken &&
        !config?.isAuth &&
        normalized.code === RequestCodeEnum.TOKEN_TIMEOUT

      if (canRefresh) {
        await doRefreshToken(that)
        return { code: normalized.code, message: normalized.message, data: null }
      }

      if (!that.isRefreshing || config?.isAuth) {
        cache.clear("all")
        window.$msg.error(normalized.message || '暂无权限..')
      }
      return { code: normalized.code, message: normalized.message, data: null }
    }

    if (normalized.code === RequestCodeEnum.SERVER_ERROR) {
      window.$msg.error('请稍后重试....')
    } else if (response && !isSuccessStatus(normalized.httpStatus)) {
      window.$msg.error(normalized.message ? `${normalized.code}:${normalized.message}` : `${normalized.httpStatus}:${response.statusText}`)
    } else {
      window.$msg.error(normalized.message || '请求错误')
    }

    if (response && !isSuccessStatus(normalized.httpStatus)) {
      return { code: normalized.code, message: normalized.message || response.statusText, data: null }
    }
    return { code: normalized.code, message: normalized.message, data: normalized.data }
  },
}

const defaultOptions = {
  baseURL: import.meta.env.VITE_APP_URL || '',
  prefix: import.meta.env.VITE_APP_PREFIX || '',
  headers: {
    'Content-Type': ContentTypeEnum.JSON,
  },
  withCredentials: false,
  withToken: true,
  requestHooks,
  codeMode: 'auto',
  requestType: 'fetch',
  retryCount: 2,
  retryTimeout: 5000,
  tokenPrefix: 'Bearer ',
  headTokenKey: 'Authorization',
  refreshTokenKey: 'Refresh-Token',
  refreshApi: '/admin/refresh',
  stateRefresh: true,
  timeout: 50000,
  isRetry: false,
  repeatRequest: false,
  isLockRequest: false,
}

const createRequest = (options) => new HttpRequst({ ...defaultOptions, ...options })

const request = createRequest()
export default request
