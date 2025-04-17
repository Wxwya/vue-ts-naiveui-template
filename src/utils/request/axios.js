import axios from "axios";
class AxiosRequest { 
   static instance;
  static getInstance() {
    if (!AxiosRequest.instance) {
      AxiosRequest.instance = new AxiosRequest();
    }
    return AxiosRequest.instance;
  }

  async request(options,config) {
    const timer = setTimeout(() => {
      options.isTimeout = true
      options.controller.abort()
    }, options.timeout)
    try {
      const response = await axios(options)
      clearTimeout(timer)
      return options.requestHooks.afterRequest(response.data, config,response)
    } catch (err) {
      window.$msg.error(err.message)
      console.error(err);
      if ((options.isRetry &&!!options.retryCount && options.retryCount <= 0) || !options.isRetry) {
        console.error('请求错误:', err)
        return {code: 0, data: null, msg: err.message || '发送请求错误'} 
      }
    }
    if (options.isRetry &&!!options.retryCount && options.retryCount > 0 && options.isTimeout) {
      await new Promise((resolve) => setTimeout(resolve, options.retryTimeout))
      options.startRetry=true
      const rquestOptionsBody = await options.requestHooks.beforeRequest(options, config)
      return this.request( rquestOptionsBody, config)
    }
    return {code: 0, data: null, msg: '请求失败'}
  }
}

const axiosRequest = AxiosRequest.getInstance();
export default axiosRequest;