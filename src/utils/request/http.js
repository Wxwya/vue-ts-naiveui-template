import { RequestMethodsEnum } from '@/enums/requestEnums'
import fetchRequest from './fetch'
import axiosRequest from './axios'

const requestController = {
  fetch: fetchRequest,
  axios: axiosRequest,
}
class HttpRequst {
  taskQueue = [] // 任务队列
  isRefreshing = false // 是否开启鉴权
  isStartTask= false // 是否开启循环任务
  options// http 配置
  constructor(options) {
    this.options = options
    if (this.options.requestHooks && this.options.requestHooks.beforeRequest) {
      this.options.requestHooks.beforeRequest = this.options.requestHooks.beforeRequest.bind(this)
    }
    if (this.options.requestHooks && this.options.requestHooks.afterRequest) {
      this.options.requestHooks.afterRequest = this.options.requestHooks.afterRequest.bind(this)
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
  get(options, config) {
    return this.request({ ...options, method: RequestMethodsEnum.GET }, config)
  }
  post(options, config){
    return this.request({ ...options, method: RequestMethodsEnum.POST }, config)
  }
  put(options, config) {
    return this.request({ ...options, method: RequestMethodsEnum.PUT }, config)
  }
  delete(options, config) {
    return this.request({ ...options, method: RequestMethodsEnum.DELETE }, config)
  }
  uploadFile(options, config) {
    return this.request({ ...options, method: RequestMethodsEnum.POST }, config)
  }

  request(options, config) {
    if (!config) {
      config = { show: false }
    }
    return new Promise(async (resolve) => {
      if (this.options.withToken && this.options.stateRefresh) {
        !config?.isAuth && this.addTask(options, config, resolve)
      }
        const newOptions = await this.options.requestHooks.beforeRequest(options, config)
        const req = await requestController[this.options.requestType].request(newOptions, config)
        if (!this.isRefreshing || config?.isAuth) {
          resolve(req)
        }
     
    })
  }
  addTask(options, config, resolve) {
    let task = async () => {
      const newOptions = await this.options.requestHooks.beforeRequest(options, config)
      resolve(requestController[this.options.requestType].request(newOptions, config))
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
