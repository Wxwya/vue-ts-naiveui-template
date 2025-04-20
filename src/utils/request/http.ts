import type { RequestOptions, RequestConfig,  RequestDefaultOptions } from './request'
import { RequestMethodsEnum } from '@/enums/requestEnums'
import fetchRequest from './fetch'
import axiosRequest from './axios'

const requestController = {
  fetch: fetchRequest,
  axios: axiosRequest,
}
class HttpRequst {
  taskQueue: Function[] = [] // 任务队列
  isRefreshing: boolean = false // 是否开启鉴权
  isStartTask: boolean = false // 是否开启循环任务
  options: RequestDefaultOptions // http 配置
  constructor(options: RequestDefaultOptions) {
    this.options = options
    if (this.options.requestHooks && this.options.requestHooks.beforeRequest) {
      this.options.requestHooks.beforeRequest = this.options.requestHooks!.beforeRequest.bind(this)
    }
    if (this.options.requestHooks && this.options.requestHooks.afterRequest) {
      this.options.requestHooks.afterRequest = this.options.requestHooks!.afterRequest.bind(this)
    }
  }
  startTaskRequest() {
    this.isStartTask = true
    while (this.taskQueue.length > 0) {
      if (!this.isRefreshing) {
        continue
      }
      const task = this.taskQueue.shift()
      if (task) {
        task()
      }
    }
    this.isStartTask = false
    this.isRefreshing = false
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
  delete<T>(options: RequestOptions, config?: RequestConfig): Promise<DecryptBody<T>> {
    return this.request<T>({ ...options, method: RequestMethodsEnum.DELETE }, config)
  }
  uploadFile<T>(options: RequestOptions, config?: RequestConfig): Promise<DecryptBody<T>> {
    return this.request<T>({ ...options, method: RequestMethodsEnum.POST }, config)
  }

  private request<T>(options: RequestOptions, config?: RequestConfig): Promise<DecryptBody<T>> {
    if (!config) {
      config = { show: false }
    }
    return new Promise(async (resolve, _) => {
      if (this.options.withToken && this.options.stateRefresh) {
        !config?.isAuth && this.addTask<T>(options, config, resolve)
      }
      const newOptions = await this.options.requestHooks!.beforeRequest(options, config)
      const req = await requestController[this.options.requestType].request<T>(newOptions, config)
      if (!this.isRefreshing || config?.isAuth) {
        resolve(req)
      }
    })
  }
  addTask<T>(options: RequestOptions, config: RequestConfig, resolve: any) {
    let task = async () => {
      const newOptions = await this.options.requestHooks!.beforeRequest(options, config)
      resolve(requestController[this.options.requestType].request<T>(newOptions, config))
    }
    this.taskQueue.push(task)
  }
  clearTasks() {
    this.taskQueue = []
    this.isStartTask = false
    this.isRefreshing = false
  }
  removeTask() {
    this.taskQueue.pop()
  }
}

export default HttpRequst
