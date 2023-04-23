import { getCurrentInstance } from 'vue'
interface msgConfig {
  ModeCode: string
  msg: any
}
export const useWebsocket: () => {
  sendMessage: (msgParams: msgConfig) => void
  getMessage: (callBack: (data: any) => any) => any
} = () => {
  const instance = getCurrentInstance()
  const ws = instance?.proxy?.$ws
  const sendMessage = (msgParams: msgConfig) => {
    ws?.send(msgParams)
  }
  const getMessage = (callBack: (data: any) => any) => {
    ws?.getMessage(callBack)
  }
  return {
    sendMessage,
    getMessage
  }
}
