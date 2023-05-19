import moment from 'moment'
import { useGlobalStore } from '@/store'
class Socket {
  socket
  lockReconnect = false
  maxReconnect = 6 // 最大重连次数， -1 标识无限重连
  reconnectCount = 0 // 重连尝试次数
  heartbeat = {
    interval: 30 * 1000, // 心跳间隔时间
    timeout: 10 * 1000, // 响应超时时间
    pingTimeoutObj: null, // 延时发送心跳的定时器
    pongTimeoutObj: null, // 接收心跳响应的定时器
    pingMessage: JSON.stringify({ type: 'ping' }) // 心跳请求信息
  }
  constructor() {
    this.globalStore = useGlobalStore()
    this.initSocket()
  }
  initSocket() {
    console.log(this.socket, '-----初始化socket')
    if (!window.WebSocket) return
    this.socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)
    this.onMessage()
    this.socket.onopen = e => {
      console.log(e, '连接成功')
      const params = {
        reqCode: 11900,
        msgUuid: new Date().getTime(),
        data: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXNfc2VydmljZV91c2VyX25hbWUiOiLlvKDlhajmoLkiLCJzeXNfcHJvZHVjdF9pZCI6ImYzZGRmOGJkMWJjY2I4OWM3YWIxNzgzNjc0NWJiN2NmNWMwMDZhMmEiLCJzeXNfdXNlcl9tb2JpbGVfcGhvbmUiOiIxNTU1NTU1NTU1NSIsInVzZXJfbmFtZSI6IuW8oOWFqOaguSIsInNjb3BlIjpbImFsbCJdLCJzeXNfdXNlcl9uYW1lIjoi5byg5YWo5qC5Iiwic3lzX3NlcnZpY2VfdXNlcl9pZCI6MjA4MTUsImV4cCI6MTY4NDQzODM2MywianRpIjoiNGFkYzU1MWUtZmI1OS00YzUyLWIxMzYtYjE3NTIxYjdlNzhjIiwiZ2xvYmFsX3VzZXJfdXVpZCI6IjVhYzBkZDQ1NzE4YTc5NGVkMzJiZGU5OTk2ODdkNGY1IiwiYXV0aG9yaXRpZXMiOlsiSklTSFUtS0FJRkFaSFVBTllPTkciXSwiY2xpZW50X2lkIjoi5Lic5bK45pm66IO95aSE572u57O757ufIn0.gMkBdiRcRDTWpdX-daVEWa0J9h2WDt2J8FkvOeRE6sFwNNGLDqnws3h-CBXmRM241HZPjosZ1fDfQFrGKiZPUJ6yHiUVFSvET0H4D1-7PvwqZyVIrroqo0_eaSO-ZdwhmblfNOwounqI_RxD8tzSNVGSS97-3jHA7Y1gTZuIAhkfa9D8BJPZjoUn4XaoxqlvrBDN_0DXvTTLCpkXp0ES35vk72rgXYRk5FN7kB8XUpLEer8IMkb643QidZDvdx0i5npne4CG72kLjpP2Bc5JeCBNT0H1g6WZCZFINk_2aKxl7H98zv4EJoshdcf00qMud9yamI605-LvAEDWTqCmQg'
      }
      this.onSend(JSON.stringify(params))
      this.reconnectTime = 0
      this.startHeartCheck()
    }
    this.socket.onclose = e => {
      this.reconnect()
    }
  }
  onSend(params) {
    if (!this.socket || this.socket.readyState !== 1) {
      console.log('请检查链接')
      return
    }
    const data = typeof params === 'string' ? params : JSON.stringify(params)
    this.socket.send(data)
  }
  onMessage(callback = () => {}) {
    if (!this.socket) return
    this.socket.onmessage = e => {
      this.startHeartCheck()
      const data = JSON.parse(e.data)
      if (data.msgCode === 11900) {
        this.globalStore.setSocketToken(data.data.userGlobalUuid)
      }
      callback(e)
    }
  }
  onClose() {
    console.log('手动关闭socket')
    if (!this.socket) return
    this.socket.close()
    this.socket = null
    this.clearTime()
  }
  // 心跳检测
  startHeartCheck() {
    console.log('心跳检测', `readyState： ${this.socket.readyState}`)
    if (this.socket.readyState !== 1) return
    this.clearTime()
    this.heartbeat.pingTimeoutObj = setTimeout(() => {
      const params = {
        reqCode: 11100,
        msgUuid: moment().valueOf(),
        data: {
          heartbeatTime: moment().format('YYYY-MM-DD HH:mm:SS'),
          msg: 'heartbeat'
        }
      }
      this.onSend(params)
      this.heartbeat.pongTimeoutObj = setTimeout(() => {
        console.log('心跳超时关闭连接')
        this.onClose()
      }, this.heartbeat.timeout)
    }, this.heartbeat.interval)
  }
  clearTime() {
    if (this.heartbeat.pingTimeoutObj) {
      clearTimeout(this.heartbeat.pingTimeoutObj)
      this.heartbeat.pingTimeoutObj = null
    }
    if (this.heartbeat.pongTimeoutObj) {
      clearTimeout(this.heartbeat.pongTimeoutObj)
      this.heartbeat.pongTimeoutObj = null
    }
  }
  // 断线重连
  reconnect() {
    console.log('断线重连', this.socket, this.lockReconnect, this.reconnectCount, this.maxReconnect)
    if (!this.socket || this.lockReconnect || this.reconnectCount > this.maxReconnect) return
    this.lockReconnect = true
    setTimeout(() => {
      this.reconnectCount++
      this.initSocket()
      this.lockReconnect = false
    }, 5000)
  }
}

export default new Socket()
