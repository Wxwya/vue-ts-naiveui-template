
self.onmessage = function (event) {
  /// 收到clear消息后, 清除定时器
  if (event.data === 'clear') {
    clearInterval(self.intervalID)
  } else {
    const delay = event.data
    self.intervalID ||= setInterval(() => {
      self.postMessage({}) // 定时通知主线程,即上文中的 xxx
    }, delay)
  }
}
