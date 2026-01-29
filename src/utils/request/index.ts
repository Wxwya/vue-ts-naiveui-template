import HttpRequst from './http'
import type { RequestHooks, RequestConfig, RequestOptions,  EncryptionBody,AxiosResponse,RequestDefaultOptions, RequestSendBodyOptions } from './request'
import { ContentTypeEnum,RequestCodeEnum,RequestMethodsEnum } from '@/enums/requestEnums'
import cache from '@/utils/cache'
import { TokenEnums } from '@/enums/cacheEnums'
import requestCancel from './cancel'
import lock from './lock'
const requestHooks: RequestHooks = {
  async beforeRequest(options: RequestOptions | RequestSendBodyOptions, config: RequestConfig): Promise<RequestSendBodyOptions>  {
    let that = this  as unknown as HttpRequst
    let newOptions: RequestSendBodyOptions 
    if ('startRetry' in options && options?.startRetry) {
      --(options.retryCount!)
      options.controller = new AbortController()
      options.signal = options.controller.signal
      return options
    }
    newOptions = {...that.options} as RequestSendBodyOptions
    newOptions.url = `${that.options.baseURL}${that.options.prefix??''}${(options?.url??'')}`
    newOptions.headers = { ...that.options.headers, ...options?.headers }
    newOptions.method = options?.method || RequestMethodsEnum.GET
    newOptions.params = options?.params || {}
    newOptions.controller = new AbortController()
    newOptions.signal = newOptions.controller.signal
    newOptions.data = options?.data || {}
    newOptions.startRetry = false
    if (newOptions.withToken) {
      const token = cache.getLocalStorage(TokenEnums.TOKEN_KEY)
      newOptions.headTokenKey &&(newOptions.headers[newOptions.headTokenKey] =  `${newOptions?.tokenPrefix??""}${token}`)  
      if (newOptions.stateRefresh) {
        const refreshToken = cache.getLocalStorage(TokenEnums.REFRESH_KEY)
        newOptions.refreshTokenKey &&(newOptions.headers[newOptions.refreshTokenKey] =  `${newOptions?.tokenPrefix??""}${refreshToken}`)   
      }
    }
    if (newOptions.repeatRequest) {
      requestCancel.add(options.url, newOptions.controller)
    }
    if ((newOptions.isLockRequest || config?.lockRequest) && !config?.excludeLock &&options.data && !!Object.keys(options.data).length ) {
      newOptions.data = await lock.encryptionRequestBody(options.data)
    }
    if (newOptions.requestType == 'fetch') {
      newOptions.url += handleParamsString(options?.params || {})
      !!Object.keys(newOptions.data).length && (newOptions.body = JSON.stringify(newOptions.data))
      newOptions.withCredentials && (newOptions.credentials = 'include')
    }
    if (options?.file) {
      // newOptions.headers['Content-Type'] = ContentTypeEnum.FORM_DATA
      delete newOptions!.headers['Content-Type']
      newOptions.data = options.file
      newOptions.body = options.file
    }
    return newOptions
  },
  async afterRequest<T>(data: DecryptBody<T>, config: RequestConfig, response: AxiosResponse | Response):Promise<DecryptBody<T>> {
    let that = this  as unknown as HttpRequst
    if ((that.options.isLockRequest || config?.lockRequest) && !config?.excludeLock && data && !!Object.keys(data).length) {
      data = (await lock.decryptResponseBody<T>(data as unknown as EncryptionBody)) ?? {} as DecryptBody<T>
    }
    if (response && (response.status != RequestCodeEnum.SUCCESS)) {
      window.$msg.error(data? `${data.code}:${JSON.stringify(data.msg)}` : `${response.status}:${response.statusText}`)
      return {code:data?data.code:response.status,msg:data?data.msg:response.statusText,data:null}
    }
    if (data) { 
      if (data.code === RequestCodeEnum.SUCCESS) {
        config?.show && window.$msg.success(config.message || data.msg || 'ok')
      } else if (RequestCodeEnum.TOKEN_INVALID.includes(data.code)) {
        if (!that.isRefreshing && that.options.stateRefresh && that.options.withToken && !config?.isAuth && data.code===RequestCodeEnum.TOKEN_TIMEOUT) {
          that.isRefreshing = true        
          const res = await that.get<any>({ url: that.options?.refreshApi??'' }, {show:false,isAuth: true }) as any
          if (res?.code == RequestCodeEnum.SUCCESS) {
            cache.setLocalStorage(TokenEnums.TOKEN_KEY, res.access_token)
            cache.setLocalStorage(TokenEnums.REFRESH_KEY, res.refresh_token)
            !that.isStartTask && that.startTaskRequest()
          }
          return {code:data.code,msg:data.msg,data:null}
        }
        if (!that.isRefreshing || config?.isAuth ) {
          cache.remove(TokenEnums.TOKEN_KEY)
          cache.remove(TokenEnums.REFRESH_KEY)
          window.$msg.error(data.msg || '暂无权限..')
          // location.reload()
        }
        return { code: data.code, msg: data.msg, data: null }
      } else if (data.code === RequestCodeEnum.SERVER_ERROR) {
        window.$msg.error('请稍后重试....')
      } else {
        window.$msg.error(data.msg || '请求错误')
      }
    }
    if (!config?.isAuth&& that.options.stateRefresh) { 
      that.removeTask()
    }
    return data
  },
}

const handleParamsString = (params: Record<string, any>): string => {
  const queryParts: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        queryParts.push(`${key}=${encodeURIComponent(v)}`);
      });
    } else if (value !== undefined && value !== null) {
      queryParts.push(`${key}=${encodeURIComponent(value)}`);
    }
  });

  return queryParts.length > 0 ? '?' + queryParts.join('&') : '';
}

const defaultOptions: RequestDefaultOptions = {
  baseURL: import.meta.env.VITE_APP_URL  || "",
  prefix: import.meta.env.VITE_APP_PREFIX  || "",
  headers: {
    'Content-Type': ContentTypeEnum.JSON,
  },
  withCredentials:true, // 是否开启cookie
  withToken:false, // 是否携带token
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
const createRequest = (options?: RequestDefaultOptions) => {
  return new HttpRequst({
    ...defaultOptions,
    ...options,
  })
}
const request = createRequest()
export default request
