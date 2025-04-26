class FetchRequest {
 static instance

  // 单例模式，获取唯一实例
 static getInstance() {
    if (!FetchRequest.instance) {
      FetchRequest.instance = new FetchRequest()
    }
    return FetchRequest.instance
  }
  async request(options, config) {
    const timer = setTimeout(() => {
      options.isTimeout = true
      options.controller.abort()
    }, options.timeout)
    try {
      const response = await fetch(options.url, options)
      clearTimeout(timer)
      const data = await response.json()
      return options.requestHooks.afterRequest(data, config, response)
    } catch (err) {
      window.$msg.error(err.message)
      console.error(err);
      if ((options.isRetry &&!!options.retryCount && options.retryCount <= 0) || !options.isRetry) {
        return {code: 0, data: null, msg: err.message || '发送请求错误'} 
      }
    }
    if (options.isRetry && !!options?.retryCount && options.retryCount > 0 && options.isTimeout) {
      await new Promise((resolve) => setTimeout(resolve, options.retryTimeout))
      options.startRetry = true
      const rquestOptionsBody = await options.requestHooks.beforeRequest(options, config)
      return this.request( rquestOptionsBody, config)
    }
    return {code: 0, data: null, msg: '请求失败'}
  }
}

const fetchRequest = FetchRequest.getInstance()
export default fetchRequest
