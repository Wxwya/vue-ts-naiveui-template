import type { RequestOptions, RequestConfig, RequestDefaultOptions } from './request'
import { RequestMethodsEnum } from '@/enums/requestEnums'
import fetchRequest from './fetch'
import axiosRequest from './axios'

const requestController = {
  fetch: fetchRequest,
  axios: axiosRequest,
}

class HttpRequst {
  taskQueue: (() => void)[] = []
  isRefreshing = false   // 是否正在刷新 token
  options: RequestDefaultOptions
  refreshPromise: Promise<any> | null = null

  constructor(options: RequestDefaultOptions) {
    this.options = options
    const hooks = this.options.requestHooks
    if (hooks) {
      if (hooks.beforeRequest) hooks.beforeRequest = hooks.beforeRequest.bind(this)
      if (hooks.afterRequest) hooks.afterRequest = hooks.afterRequest.bind(this)
    }
  }

  startTaskRequest() {
    const tasks = [...this.taskQueue]
    this.taskQueue = []
    this.isRefreshing = false
    this.refreshPromise = null
    tasks.forEach(task => task())
  }

  get<T>(options: RequestOptions, config?: RequestConfig): Promise<DecryptBody<T>> {
    return this.request<T>({ ...options, method: RequestMethodsEnum.GET }, config)
  }

  post<T>(options: RequestOptions, config?: RequestConfig): Promise<DecryptBody<T>> {
    return this.request<T>({ ...options, method: RequestMethodsEnum.POST }, config)
  }

  put<T>(options: RequestOptions, config?: RequestConfig): Promise<DecryptBody<T>> {
    return this.request<T>({ ...options, method: RequestMethodsEnum.PUT }, config)
  }

  patch<T>(options: RequestOptions, config?: RequestConfig): Promise<DecryptBody<T>> {
    return this.request<T>({ ...options, method: RequestMethodsEnum.PATCH }, config)
  }

  delete<T>(options: RequestOptions, config?: RequestConfig): Promise<DecryptBody<T>> {
    return this.request<T>({ ...options, method: RequestMethodsEnum.DELETE }, config)
  }

  uploadFile<T>(options: RequestOptions, config?: RequestConfig): Promise<DecryptBody<T>> {
    return this.request<T>({ ...options, method: RequestMethodsEnum.POST }, config)
  }

  private request<T>(options: RequestOptions, config?: RequestConfig): Promise<DecryptBody<T>> {
    if (!config) config = { show: false }

    const needsAuth = this.options.withToken && this.options.stateRefresh && !config.isAuth

    // refresh 进行中，新请求入队等待
    if (this.isRefreshing && needsAuth) {
      return new Promise<DecryptBody<T>>((resolve) => {
        this.taskQueue.push(async () => {
          const newOptions = await this.options.requestHooks.beforeRequest(options, config)
          resolve(requestController[this.options.requestType].request(newOptions, config))
        })
      })
    }

    return this.executeRequest<T>(options, config, needsAuth as boolean)
  }

  private async executeRequest<T>(options: RequestOptions, config: RequestConfig, needsAuth: boolean): Promise<DecryptBody<T>> {
    const newOptions = await this.options.requestHooks.beforeRequest(options, config)
    const req = await requestController[this.options.requestType].request<any>(newOptions, config)

    // afterRequest 内可能已将 isRefreshing 置为 true（401 触发了 refresh）
    // 此时不应直接 resolve 失败结果，改为入队等 refresh 完后 retry
    if (this.isRefreshing && needsAuth) {
      return new Promise<DecryptBody<T>>((resolve) => {
        this.taskQueue.push(async () => {
          const retryOptions = await this.options.requestHooks.beforeRequest(options, config)
          resolve(requestController[this.options.requestType].request(retryOptions, config))
        })
      })
    }

    return req
  }

  clearTasks() {
    this.taskQueue = []
    this.isRefreshing = false
    this.refreshPromise = null
  }
}

export default HttpRequst
