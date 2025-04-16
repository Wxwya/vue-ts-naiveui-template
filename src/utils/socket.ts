/**
 * WebSocket.CONNECTING === 0
 * WebSocket.OPEN === 1
 * WebSocket.CLOSING === 2
 * WebSocket.CLOSED === 3
 */
type WsConfig = {
  baseUrl: string
  header?: string[]
  reconnectCount?: number
  heartbeatSendTime?: number
  reconnectTimeInterval?: number
}
type MessageData = {
  type: number // 1:心跳 2:单聊 3:群聊 4:系统消息
  data: any // 消息内容
  sender: string // 发送者
  receiver: string // 接收者 
}
type WebsocketExample = {
  name: string
  url: string
  socket: WebSocket
  isActiveClose: boolean
  reconnectCount: number
}
type ConnectConfig = {
  name: string
  url: string
}
type errorFunc = (error: Event) => void
type messageFunc = (data: MessageData) => void
const excludeKey = ['onMessage', 'onError',   'sockteManager', 'messagePipe',"worker","isNetwork"]
/**
 * 1006（异常关闭，CLOSE_ABNORMAL）：​表示连接异常关闭，通常由于网络问题或服务器崩溃等原因导致。由于未发送关闭帧，客户端无法获知具体原因，因此需要尝试重新连接。​
 * 1001（终端离开，CLOSE_GOING_AWAY）：​表示服务器或客户端由于关闭、重启等原因主动断开连接。此时，客户端可以尝试重新建立连接。​
 * 1005（无状态码，CLOSE_NO_STATUS）：​表示未收到预期的关闭状态码，可能由于连接中断等原因导致。客户端应考虑重新连接。
 */
const errorCodes = [1006, 1001, 1005]
const pingMsg:MessageData = {
  type: 1,
  data: '',
  sender: '',
  receiver: ''
}
class Ws {
   name: string = crypto.randomUUID()
  private baseUrl: string = ""
  private header: string[]  = []
  private reconnectCount: number = 3
  private heartbeatSendTime: number = 60000
  private reconnectTimeInterval: number = 5000
  private  onMessage: Map<string, messageFunc[]> = new Map<string, messageFunc[]>()
  private onError: Map<string, errorFunc[]> = new Map<string, errorFunc[]>()
  private  sockteManager: Map<string, WebsocketExample> = new Map<string, WebsocketExample>()
  private messagePipe: Map<string, MessageData[]> = new Map<string, MessageData[]>()
  private  worker: Worker| null = null
  private isNetwork: boolean = false
  constructor(config: WsConfig) {
    for (let key in config) {
      if (!excludeKey.includes(key)) {
        this[key] = config[key]
      }
    }
  }
  getWsContainer() {
    return this.sockteManager
  }

  addCheckMessage(name: string, func: messageFunc) {
    if (!this.onMessage.has(name)) {
      this.onMessage.set(name, [])
    }
    this.onMessage.get(name)!.push(func)
  }
  addCheckError(name: string, func: errorFunc) {
    if (!this.onError.has(name)) {
      this.onError.set(name, [])
    }
    this.onError.get(name)!.push(func)
  }
  // 发送消息
  send(name: string, msg: MessageData) {
    
    // 如果不存在直接把数据存到管道
    if (!this.sockteManager.has(name)) {
      this.setMessagePipe(name, msg)
      return
    }
    let wsExample = this.sockteManager.get(name)
    // 如果连接成功，直接发送
    if (wsExample&&wsExample.socket.readyState === WebSocket.OPEN) {
      wsExample.socket.send(JSON.stringify(msg))
      return
    }
    // 如果连接失败，把数据存到管道（等待重新连接的时候再发送）
    this.setMessagePipe(name, msg)
  }

  private  setMessagePipe = (name: string,msg: MessageData) => {
    if (!this.messagePipe.has(name)) {
      this.messagePipe.set(name, [])
    }
    this.messagePipe.get(name)!.push(msg)
  }
  // 连接
  connect(config: ConnectConfig): string {
    const { name, url } = config
    if (!name || !url) {
      throw new Error('ws 名称和url不能为空')
     
    }
    let wsUrl
    if (this.baseUrl) {
      wsUrl = this.baseUrl + url
    }
    let ws = new WebSocket(wsUrl,this.header)
    let myWs: WebsocketExample = {
      name,
      url,
      socket: ws,
      isActiveClose: false,
      reconnectCount: this.reconnectCount,
    }
    if (!this.sockteManager.has(name)) {
      this.sockteManager.set(name, myWs)
    } else { 
      myWs.reconnectCount = this.sockteManager.get(name)!.reconnectCount 
      this.sockteManager.set(name, myWs)
    }

    ws.onopen = () => {
      console.log(`${name} 连接成功`, this)
      this.resetReconnectCount(name) // 重置重连次数 
      // 判断是否开启网络检测 心跳检测
      if (!this.isNetwork) { 
        this.start() // 开启网络检测
      }
      if (this.messagePipe.has(name)) {  // 如果管道有数据，则发送
        this.messagePipe.get(name)?.forEach((msg) => {
          this.send(name, msg)
        })
      }
      
    }
    ws.onmessage = (msg:MessageEvent) => {
      if (this.onMessage.has(name)) {
        this.onMessage.get(name)?.forEach((f) => {
          f(JSON.parse(msg.data))
        })
      }
    }
    ws.onerror = (error:Event) => {
      if (this.onError.has(name)) { 
        this.onError.get(name)?.forEach((f) => { 
          f(error)
        })
      }
      
    }
    ws.onclose = (event) => {
      if (!errorCodes.includes(event.code)) return
      let wsExample = this.sockteManager.get(name)
      if (!this.isNetwork) {
        throw new Error('网络异常')
        return
      }
      if (wsExample && wsExample.isActiveClose) {
        this.deleteMap(name)
        return
      }
      if (wsExample && wsExample.socket.readyState === WebSocket.CLOSED && wsExample.reconnectCount > 0) { 
        this.reconnect(name)
      }
    }
    return name
  }
  // 关闭
  close(name) {
    if (this.sockteManager.has(name)) {
      let wsExample = this.sockteManager.get(name)
      if (wsExample) { 
        wsExample.isActiveClose = true
        wsExample.socket.close()
      }
    }
  }
  private  start() {
    this.startNetwork()
      this.startWroker()
    
  }
  private  deleteMap(name) {
    this.sockteManager.delete(name)
    this.onMessage.delete(name)
    this.onError.delete(name)
    if (this.sockteManager.size === 0) {
      this.stopNetwork() // 当没有socket连接的时候，关闭网络检测
      this.closeWroker() // 关闭心跳检测
     }
  }
  // 重连
  private  reconnect(name) {
    let wsExample = this.sockteManager.get(name)
    if (wsExample) { 
      if (wsExample.reconnectCount <= 0) {
        this.deleteMap(name)
        throw new Error('重连失败')
        return
      }
      setTimeout(() => {
        --wsExample.reconnectCount
        this.connect({ name: wsExample.name, url: wsExample.url })
      }, this.reconnectTimeInterval)
    }
   
  }
  private  resetReconnectCount(name:string) {
    let socket = this.sockteManager.get(name)
    if (socket) { 
      socket.reconnectCount = this.reconnectCount
      this.sockteManager.set(name, socket)
    }
  }
  private  startHeartbeat() {
    this.sockteManager.forEach((wsExample) => {
      if (wsExample.socket.readyState === WebSocket.OPEN) {
        wsExample.socket.send(JSON.stringify(pingMsg))
       }
    })
  }
  private  onNetwork=()=> {
    // 开启网络检测
    if (navigator.onLine) {
      this.startWroker()
      // 循环重连
      this.sockteManager.forEach((wsExample) => {
        if (wsExample.socket.readyState != WebSocket.OPEN) { 
          this.reconnect(wsExample.name)
        }
      })
    } else {
      this.closeWroker()
    }
    this.isNetwork = navigator.onLine
  }
  private  startNetwork() {
    if (!this.isNetwork) {
      this.isNetwork = true
      window.addEventListener('online', this.onNetwork)
      window.addEventListener('offline', this.onNetwork)
    }
  }
  private  stopNetwork() {
    if (this.isNetwork) {
      window.removeEventListener('online', this.onNetwork)
      window.removeEventListener('offline', this.onNetwork)
      this.isNetwork = false
    }
  }
  private  startWroker() {
    this.worker = new Worker('/worker.ts')
    this.worker?.postMessage(this.heartbeatSendTime) // 传递 delay 延时参数

    // 接收 Web Worker 的消息
    if (this.worker) {
      this.worker.onmessage = () => {
        this.startHeartbeat()
      }
    }
    
  }
  private  closeWroker() {
    this.worker?.postMessage('clear')
    this.worker?.terminate()
  }
}


export default Ws
